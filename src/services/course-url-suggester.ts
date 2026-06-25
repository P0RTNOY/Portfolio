import "server-only";

import { generateHuggingFaceText } from "@/lib/huggingface";
import type { CourseUrlMetadata } from "@/lib/course-metadata";
import { courseStatusValues } from "@/lib/validations/course";

export type CourseUrlSuggestion = {
  certificateUrl: string | null;
  courseUrl: string;
  credentialUrl: string | null;
  fullDescription: string;
  imageUrl: string | null;
  instructor: string | null;
  progress: number;
  provider: string;
  shortDescription: string;
  skills: string[];
  slug: string;
  status: (typeof courseStatusValues)[number];
  title: string;
};

type CourseUrlSuggestionResult = {
  aiWarning?: string;
  ok: true;
  suggestion: CourseUrlSuggestion;
};

const courseSuggestionResponseFormat = {
  json_schema: {
    name: "CourseUrlSuggestion",
    schema: {
      additionalProperties: false,
      properties: {
        fullDescription: { type: "string" },
        shortDescription: { type: "string" },
        skills: {
          items: { type: "string" },
          maxItems: 12,
          type: "array",
        },
        slug: { type: "string" },
        title: { type: "string" },
      },
      required: [
        "fullDescription",
        "shortDescription",
        "skills",
        "slug",
        "title",
      ],
      type: "object",
    },
    strict: true,
  },
  type: "json_schema",
};

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 180) || "course"
  );
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

function fallbackSuggestion(metadata: CourseUrlMetadata): CourseUrlSuggestion {
  const title = metadata.title ?? "Imported Course";
  const description =
    metadata.description ??
    "A course imported from a public course page. Review and personalize this description before publishing.";

  return {
    certificateUrl: null,
    courseUrl: metadata.canonicalUrl,
    credentialUrl: null,
    fullDescription: description,
    imageUrl: metadata.imageUrl,
    instructor: metadata.instructor,
    progress: 0,
    provider: metadata.provider ?? "Learning Platform",
    shortDescription: truncate(description, 280),
    skills: [],
    slug: slugify(title),
    status: "planned",
    title,
  };
}

function parseAiSuggestion(text: string, metadata: CourseUrlMetadata) {
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
    const fallback = fallbackSuggestion(metadata);
    const title = cleanString(parsed.title, 180) ?? fallback.title;
    const shortDescription =
      cleanString(parsed.shortDescription, 280) ?? fallback.shortDescription;

    return {
      ...fallback,
      fullDescription:
        cleanString(parsed.fullDescription, 5000) ?? fallback.fullDescription,
      shortDescription,
      skills: cleanStringArray(parsed.skills, 12),
      slug: slugify(cleanString(parsed.slug, 180) ?? title),
      title,
    } satisfies CourseUrlSuggestion;
  } catch {
    return null;
  }
}

function buildCoursePrompt(metadata: CourseUrlMetadata) {
  return [
    "Convert this public course page metadata into editable fields for a portfolio course form.",
    "Use only the metadata provided. Do not invent personal completion status, grades, certificates, employment history, or claims about the student.",
    "The title should be concise and human-readable.",
    "The slug must be lowercase words separated by hyphens.",
    "The shortDescription must be 10-280 characters.",
    "The fullDescription should summarize what the course covers in professional portfolio language.",
    "Skills should be concise keywords derived from the course topic.",
    "",
    `Course URL: ${metadata.canonicalUrl}`,
    `Title: ${metadata.title ?? "Not provided"}`,
    `Provider: ${metadata.provider ?? "Not provided"}`,
    `Instructor: ${metadata.instructor ?? "Not provided"}`,
    `Description: ${metadata.description ?? "Not provided"}`,
    `Image URL: ${metadata.imageUrl ?? "Not provided"}`,
  ].join("\n");
}

export async function generateCourseUrlSuggestion(
  metadata: CourseUrlMetadata,
): Promise<CourseUrlSuggestionResult> {
  const result = await generateHuggingFaceText({
    maxNewTokens: 900,
    prompt: buildCoursePrompt(metadata),
    responseFormat: courseSuggestionResponseFormat,
    systemPrompt:
      "You convert public course metadata into grounded portfolio course form suggestions. Return only valid JSON.",
    temperature: 0.35,
  });

  if (!result.ok) {
    return {
      aiWarning: result.error,
      ok: true,
      suggestion: fallbackSuggestion(metadata),
    };
  }

  const suggestion = parseAiSuggestion(result.text, metadata);

  if (!suggestion) {
    return {
      aiWarning: "The AI response could not be converted into course fields.",
      ok: true,
      suggestion: fallbackSuggestion(metadata),
    };
  }

  return {
    ok: true,
    suggestion,
  };
}

