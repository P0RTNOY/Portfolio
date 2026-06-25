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

function normalizeCourseTitle(value: string) {
  const trimmed = value.trim();
  const [beforeDash] = trimmed.split(/\s+-\s+/);
  const title = beforeDash && beforeDash.length >= 8 ? beforeDash : trimmed;

  return truncate(title.replace(/[.!?]+$/, ""), 120);
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

function normalizePastedDetails(value: string | undefined) {
  return value?.trim().replace(/\r\n/g, "\n").slice(0, 12000);
}

function firstMeaningfulLine(text: string | undefined) {
  if (!text) {
    return null;
  }

  const ignoredPrefixes = [
    "who this course is for",
    "requirements",
    "what you'll learn",
    "what you will learn",
    "description",
    "course content",
  ];

  return (
    text
      .split("\n")
      .map((line) => line.trim())
      .find((line) => {
        if (line.length < 8 || line.length > 180) {
          return false;
        }

        const normalized = line.toLowerCase().replace(/:$/, "");
        return !ignoredPrefixes.includes(normalized);
      }) ?? null
  );
}

function extractInstructorFromText(text: string | undefined) {
  if (!text) {
    return null;
  }

  const patterns = [
    /(?:instructor|created by|taught by)\s*:?\s*([^\n.]+)/i,
    /by\s+([A-Z][A-Za-z .'-]+)(?:\n|$)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern)?.[1]?.trim();

    if (match && match.length <= 120) {
      return match;
    }
  }

  return null;
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
  const cleanedPastedDetails = normalizePastedDetails(pastedDetails);
  const title = normalizeCourseTitle(
    firstMeaningfulLine(cleanedPastedDetails) ??
      metadata.title ??
      "Imported Course",
  );
  const description = fallbackDescription(metadata, pastedDetails);

  return {
    certificateUrl: null,
    courseUrl: metadata.canonicalUrl,
    credentialUrl: null,
    fullDescription: description,
    imageUrl: metadata.imageUrl,
    instructor:
      metadata.instructor ?? extractInstructorFromText(cleanedPastedDetails),
    progress: 0,
    provider: metadata.provider ?? "Learning Platform",
    shortDescription: truncate(description, 280),
    skills: inferSkillsFromText(
      [metadata.title, metadata.description, cleanedPastedDetails]
        .filter(Boolean)
        .join("\n"),
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
    const title = normalizeCourseTitle(
      cleanString(parsed.title, 180) ?? fallback.title,
    );
    const shortDescription =
      cleanString(parsed.shortDescription, 280) ?? fallback.shortDescription;
    const parsedSkills = cleanStringArray(parsed.skills, 12);
    const mergedSkills =
      parsedSkills.length > 0
        ? parsedSkills
        : fallback.skills;

    return {
      ...fallback,
      fullDescription:
        cleanString(parsed.fullDescription, 5000) ?? fallback.fullDescription,
      shortDescription,
      imageUrl: cleanString(parsed.imageUrl, 800) ?? fallback.imageUrl,
      instructor: cleanString(parsed.instructor, 160) ?? fallback.instructor,
      provider: cleanString(parsed.provider, 80) ?? fallback.provider,
      skills: mergedSkills,
      slug: slugify(cleanString(parsed.slug, 180) ?? title),
      title,
    } satisfies CourseUrlSuggestion;
  } catch {
    return null;
  }
}

function buildCoursePrompt(metadata: CourseUrlMetadata, pastedDetails?: string) {
  const hasSparseMetadata = !metadata.title && !metadata.description;
  const cleanedPastedDetails = normalizePastedDetails(pastedDetails);

  return [
    "You are an extraction engine for a portfolio admin form.",
    "Task: read the supplied course URL, page metadata, and pasted course text, then return normalized course fields.",
    "Use the pasted course text as the highest-priority source. Use metadata second. Use URL only as weak fallback.",
    "Do not write marketing hype. Do not invent personal completion status, grades, certificates, jobs, employers, awards, or student claims.",
    "Do not invent an instructor or image URL. Return null if not present.",
    "Extract concrete technical skills/topics from the description and learning outcomes. Do not use audience labels such as Students, Graduates, IT Professionals, Military Personnel, or Government Employees as skills.",
    "For this portfolio, titles should be specific, e.g. 'CompTIA Security+ (SY0-701) Bootcamp' instead of 'Security Plus' when the pasted text supports it.",
    "shortDescription must be 120-220 characters and describe the course content.",
    "fullDescription must be 2-4 professional sentences summarizing what the course covers.",
    "slug must be lowercase words separated by hyphens.",
    "Return ONLY valid JSON. No markdown. No commentary.",
    "JSON shape:",
    '{"title":"string","slug":"string","provider":"string","instructor":"string|null","imageUrl":"string|null","shortDescription":"string","fullDescription":"string","skills":["string"]}',
    "Example skills style: ['CompTIA Security+', 'Cybersecurity', 'Network Security', 'Risk Management', 'Cryptography'].",
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
    maxNewTokens: 1400,
    prompt: buildCoursePrompt(metadata, pastedDetails),
    systemPrompt:
      "You are a strict JSON extraction engine. Return only a single valid JSON object.",
    temperature: 0.15,
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
