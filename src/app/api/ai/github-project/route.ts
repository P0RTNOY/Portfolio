import type { NextRequest } from "next/server";
import { z } from "zod";

import { apiError, apiJson } from "@/lib/api/response";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { getGithubRepoContext, GithubRepoError } from "@/lib/github-repo";
import { createGithubProjectSuggestion } from "@/services/ai-project-assistant";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const githubProjectRequestSchema = z.object({
  repoUrl: z.string().trim().min(1, "Repository URL is required.").max(500),
});

export async function POST(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);

  if (!session) {
    return apiError("UNAUTHORIZED", "Admin authentication is required.", 401);
  }

  const payload: unknown = await request.json().catch(() => null);
  const parsed = githubProjectRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Repository URL is missing or invalid.",
      400,
      parsed.error.flatten(),
    );
  }

  try {
    const repo = await getGithubRepoContext(parsed.data.repoUrl);
    const result = await createGithubProjectSuggestion(repo);

    if (!result.ok) {
      return apiError(result.code, result.error, 503);
    }

    return apiJson({
      repo: {
        description: repo.description,
        fullName: repo.fullName,
        htmlUrl: repo.htmlUrl,
        languages: repo.languages,
        readmeFound: Boolean(repo.readme),
        topics: repo.topics,
      },
      suggestion: result.suggestion,
    });
  } catch (error) {
    if (error instanceof GithubRepoError) {
      return apiError(error.code, error.message, 400);
    }

    console.error(error);
    return apiError(
      "GITHUB_IMPORT_FAILED",
      "The GitHub repository could not be analyzed right now.",
      500,
    );
  }
}
