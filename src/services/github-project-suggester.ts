import "server-only";

import { generateHuggingFaceText } from "@/lib/huggingface";
import type { GithubRepoContext } from "@/lib/github-repo";
import { projectStatusValues } from "@/lib/validations/project";

export type GithubProjectSuggestion = {
  fullDescription: string;
  githubUrl: string;
  highlights: string[];
  liveUrl: string | null;
  problemSolved: string | null;
  role: string | null;
  shortDescription: string;
  slug: string;
  status: (typeof projectStatusValues)[number];
  techStack: string[];
  technicalChallenges: string | null;
  title: string;
};

type GithubProjectSuggestionResult =
  | {
      ok: true;
      suggestion: GithubProjectSuggestion;
    }
  | {
      code: "AI_DISABLED" | "AI_GENERATION_FAILED";
      error: string;
      ok: false;
    };

const githubProjectResponseFormat = {
  json_schema: {
    name: "GithubProjectSuggestion",
    schema: {
      additionalProperties: false,
      properties: {
        fullDescription: { type: "string" },
        highlights: {
          items: { type: "string" },
          maxItems: 5,
          minItems: 3,
          type: "array",
        },
        liveUrl: {
          anyOf: [{ type: "string" }, { type: "null" }],
        },
        problemSolved: {
          anyOf: [{ type: "string" }, { type: "null" }],
        },
        role: {
          anyOf: [{ type: "string" }, { type: "null" }],
        },
        shortDescription: { type: "string" },
        slug: { type: "string" },
        status: {
          enum: projectStatusValues,
          type: "string",
        },
        techStack: {
          items: { type: "string" },
          maxItems: 12,
          type: "array",
        },
        technicalChallenges: {
          anyOf: [{ type: "string" }, { type: "null" }],
        },
        title: { type: "string" },
      },
      required: [
        "fullDescription",
        "highlights",
        "liveUrl",
        "problemSolved",
        "role",
        "shortDescription",
        "slug",
        "status",
        "techStack",
        "technicalChallenges",
        "title",
      ],
      type: "object",
    },
    strict: true,
  },
  type: "json_schema",
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, maxLength).trim() : value;
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim()
    ? truncate(value.trim(), maxLength)
    : null;
}

function cleanStringArray(value: unknown, maxItems: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

function parseSuggestion(text: string, repo: GithubRepoContext) {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    return null;
  }

  try {
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as Record<
      string,
      unknown
    >;
    const title = cleanString(parsed.title, 120) ?? repo.name;
    const rawStatus = cleanString(parsed.status, 40);
    const status = projectStatusValues.includes(
      rawStatus as (typeof projectStatusValues)[number],
    )
      ? (rawStatus as (typeof projectStatusValues)[number])
      : "completed";

    return {
      fullDescription:
        cleanString(parsed.fullDescription, 5000) ??
        repo.description ??
        "Add a detailed description after reviewing the repository.",
      githubUrl: repo.htmlUrl,
      highlights: cleanStringArray(parsed.highlights, 5),
      liveUrl: cleanString(parsed.liveUrl, 500) ?? repo.homepage,
      problemSolved: cleanString(parsed.problemSolved, 1000),
      role: cleanString(parsed.role, 200),
      shortDescription:
        cleanString(parsed.shortDescription, 240) ??
        repo.description ??
        "A project imported from GitHub.",
      slug: slugify(cleanString(parsed.slug, 140) ?? repo.name),
      status,
      techStack: cleanStringArray(parsed.techStack, 12),
      technicalChallenges: cleanString(parsed.technicalChallenges, 1000),
      title,
    } satisfies GithubProjectSuggestion;
  } catch {
    return null;
  }
}

function buildRepoPrompt(repo: GithubRepoContext) {
  const manifestBlocks = repo.manifests.map((manifest) =>
    [
      `Manifest: ${manifest.path}`,
      "```",
      manifest.content.slice(0, 5000),
      "```",
    ].join("\n"),
  );

  return [
    "Analyze this GitHub repository and suggest editable fields for a portfolio project form.",
    "Use only the repository metadata, README, languages, topics, and manifests provided here.",
    "Do not invent users, companies, client work, production metrics, awards, employers, or personal background.",
    "Prefer clear, professional portfolio language.",
    "If the repository does not make a field clear, use a conservative generic suggestion or null.",
    "The title should be human-readable, not necessarily the raw repository name.",
    "The slug must be lowercase words separated by hyphens.",
    "The shortDescription must be 10-240 characters.",
    "The status should usually be completed for an existing repository unless the README clearly says otherwise.",
    "",
    `Repository: ${repo.fullName}`,
    `URL: ${repo.htmlUrl}`,
    `Description: ${repo.description ?? "Not provided"}`,
    `Homepage: ${repo.homepage ?? "Not provided"}`,
    `License: ${repo.license ?? "Not provided"}`,
    `Topics: ${repo.topics.join(", ") || "None"}`,
    `Languages: ${repo.languages.join(", ") || "Unknown"}`,
    "",
    "README:",
    "```",
    repo.readme ?? "No README was found.",
    "```",
    "",
    ...manifestBlocks,
  ].join("\n");
}

export async function generateGithubProjectSuggestion(
  repo: GithubRepoContext,
): Promise<GithubProjectSuggestionResult> {
  const result = await generateHuggingFaceText({
    maxNewTokens: 1200,
    prompt: buildRepoPrompt(repo),
    responseFormat: githubProjectResponseFormat,
    systemPrompt:
      "You convert GitHub repository context into grounded portfolio project form suggestions. Return only valid JSON.",
    temperature: 0.45,
  });

  if (!result.ok) {
    return {
      code:
        result.code === "HF_NOT_CONFIGURED"
          ? "AI_DISABLED"
          : "AI_GENERATION_FAILED",
      error: result.error,
      ok: false,
    };
  }

  const suggestion = parseSuggestion(result.text, repo);

  if (!suggestion) {
    return {
      code: "AI_GENERATION_FAILED",
      error: "The AI response could not be converted into project fields.",
      ok: false,
    };
  }

  return {
    ok: true,
    suggestion,
  };
}
