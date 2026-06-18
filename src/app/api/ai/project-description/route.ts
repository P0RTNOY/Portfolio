import type { NextRequest } from "next/server";
import { z } from "zod";

import { apiError, apiJson } from "@/lib/api/response";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { createProjectDescriptionSuggestion } from "@/services/ai-project-assistant";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const projectDescriptionRequestSchema = z.object({
  problemSolved: z.string().trim().max(2000).optional().nullable(),
  role: z.string().trim().max(200).optional().nullable(),
  shortDescription: z.string().trim().max(500).optional().nullable(),
  techStack: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  technicalChallenges: z.string().trim().max(2000).optional().nullable(),
  title: z.string().trim().min(2).max(120),
});

export async function POST(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);

  if (!session) {
    return apiError("UNAUTHORIZED", "Admin authentication is required.", 401);
  }

  const payload: unknown = await request.json().catch(() => null);
  const parsed = projectDescriptionRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return apiError(
      "VALIDATION_ERROR",
      "Project context is incomplete or invalid.",
      400,
      parsed.error.flatten(),
    );
  }

  const suggestion = await createProjectDescriptionSuggestion(parsed.data);

  if (!suggestion.ok) {
    return apiError(suggestion.code, suggestion.error, 503);
  }

  return apiJson({
    suggestion: {
      fullDescription: suggestion.draft,
      highlights: suggestion.highlights,
    },
  });
}
