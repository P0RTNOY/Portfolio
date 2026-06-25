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

const skillPatterns: Array<[RegExp, string]> = [
  [/comptia security\+|security\+|sy0[-\s]?701/i, "CompTIA Security+"],
  [/cybersecurity|information security/i, "Cybersecurity"],
  [/network security|networking/i, "Network Security"],
  [/risk management|risk/i, "Risk Management"],
  [/identity|access management|iam/i, "Identity and Access Management"],
  [/cryptography|encryption/i, "Cryptography"],
  [/security operations|operations/i, "Security Operations"],
  [/incident response|incident/i, "Incident Response"],
  [/governance|compliance/i, "Governance and Compliance"],
  [/threat|threat analysis/i, "Threat Analysis"],
  [/vulnerability|vulnerabilities/i, "Vulnerability Management"],
  [/certification|exam/i, "Certification Prep"],
];

function inferSkillsFromText(text: string | undefined) {
  if (!text) {
    return [];
  }

  return skillPatterns
    .filter(([pattern]) => pattern.test(text))
    .map(([, skill]) => skill)
    .slice(0, 12);
}

function fallbackDescription(metadata: CourseUrlMetadata, pastedDetails?: string) {
  if (metadata.description) {
    return metadata.description;
  }

  const pastedDescription = pastedDetails?.slice(0, 5000).trim();

  if (!pastedDescription) {
    return "A course imported from a public course page. Review and personalize this description before publishing.";
  }

  const firstSentence = pastedDescription.match(/^.{80,280}?[.!?](?:\s|$)/)?.[0];
  return firstSentence?.trim() || pastedDescription;
}

function fallbackSuggestion(
  metadata: CourseUrlMetadata,
  pastedDetails?: string,
): CourseUrlSuggestion {
  const title = metadata.title ?? "Imported Course";
  const description = fallbackDescription(metadata, pastedDetails);

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
    skills: inferSkillsFromText(
      [metadata.title, metadata.description, pastedDetails].filter(Boolean).join("\n"),
    ),
    slug: slugify(title),
    status: "planned",
    title,
  };
}

function parseAiSuggestion(
  text: string,
  metadata: CourseUrlMetadata,
  pastedDetails?: string,
) {
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
    const fallback = fallbackSuggestion(metadata, pastedDetails);
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

function buildCoursePrompt(metadata: CourseUrlMetadata, pastedDetails?: string) {
  const hasSparseMetadata = !metadata.title && !metadata.description;
  const cleanedPastedDetails = pastedDetails?.trim();

  return [
    "Convert this public course page metadata into editable fields for a portfolio course form.",
    "Use only the URL, metadata, and pasted course details provided. Do not invent personal completion status, grades, certificates, employment history, or claims about the student.",
    "If metadata is sparse because a provider blocked crawling, infer conservative course fields from the URL and provider only.",
    "Do not invent an instructor or image URL when not provided.",
    "If pasted course details include a title, instructor, course description, topics, or what-you-will-learn bullets, use them as the strongest source.",
    "The title should be concise and human-readable.",
    "The slug must be lowercase words separated by hyphens.",
    "The shortDescription must be 10-280 characters.",
    "The fullDescription should summarize what the course covers in professional portfolio language.",
    "Skills should be concise keywords derived from the course topic.",
    "Return only a JSON object with these keys: title, slug, shortDescription, fullDescription, skills.",
    "The skills value must be an array of strings.",
    "",
    `Course URL: ${metadata.canonicalUrl}`,
    `Title: ${metadata.title ?? "Not provided"}`,
    `Provider: ${metadata.provider ?? "Not provided"}`,
    `Instructor: ${metadata.instructor ?? "Not provided"}`,
    `Description: ${metadata.description ?? "Not provided"}`,
    `Image URL: ${metadata.imageUrl ?? "Not provided"}`,
    `Metadata quality: ${
      cleanedPastedDetails
        ? "Pasted course details supplied by admin"
        : hasSparseMetadata
          ? "Sparse URL-only fallback"
          : "Fetched page metadata"
    }`,
    "",
    "Pasted course details:",
    "```",
    cleanedPastedDetails || "Not provided",
    "```",
  ].join("\n");
}

export async function generateCourseUrlSuggestion(
  metadata: CourseUrlMetadata,
  pastedDetails?: string,
): Promise<CourseUrlSuggestionResult> {
  const result = await generateHuggingFaceText({
    maxNewTokens: 1100,
    prompt: buildCoursePrompt(metadata, pastedDetails),
    systemPrompt:
      "You convert public course metadata into grounded portfolio course form suggestions. Return only valid JSON.",
    temperature: 0.35,
  });

  if (!result.ok) {
    return {
      aiWarning: result.error,
      ok: true,
      suggestion: fallbackSuggestion(metadata, pastedDetails),
    };
  }

  const suggestion = parseAiSuggestion(result.text, metadata, pastedDetails);

  if (!suggestion) {
    return {
      aiWarning: "The AI response could not be converted into course fields.",
      ok: true,
      suggestion: fallbackSuggestion(metadata, pastedDetails),
    };
  }

  return {
    ok: true,
    suggestion,
  };
}
