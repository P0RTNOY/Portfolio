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
  if (value.length <= maxLength) {
    return value;
  }

  const sliced = value.slice(0, maxLength).trim();
  const lastSpace = sliced.lastIndexOf(" ");
  const truncated =
    lastSpace > Math.floor(maxLength * 0.7)
      ? sliced.slice(0, lastSpace)
      : sliced;

  return truncated.replace(/[,\s]+$/, "");
}

function normalizeCourseTitle(value: string) {
  const trimmed = value.trim();
  const [beforeDash] = trimmed.split(/\s+-\s+/);
  const title = beforeDash && beforeDash.length >= 8 ? beforeDash : trimmed;

  return truncate(title.replace(/[.!?]+$/, ""), 120);
}

function cleanInstructorName(value: string | null) {
  if (!value) {
    return null;
  }

  const [name] = value
    .replace(/\s+/g, " ")
    .split(/\s+(?:•|\||-)\s+/);

  return name ? truncate(name.trim(), 120) : null;
}

function looksLikeCourseTitle(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  return /\b(course|bootcamp|certification|exam|training|masterclass|workshop|comptia|security\+|sy0[-\s]?701)\b/i.test(
    value,
  );
}

function looksLikeMarketingSentence(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();

  return (
    normalized.length > 90 ||
    /\b(is|are|learn|prepare|covers|includes|today|world'?s|best|popular)\b/.test(
      normalized,
    ) ||
    /[.!?]$/.test(normalized)
  );
}

function chooseBestCourseTitle({
  fallbackTitle,
  metadataTitle,
  parsedTitle,
  pastedDetails,
}: {
  fallbackTitle: string;
  metadataTitle: string | null;
  parsedTitle?: string | null;
  pastedDetails?: string;
}) {
  const normalizedParsed = parsedTitle ? normalizeCourseTitle(parsedTitle) : null;
  const normalizedMetadata = metadataTitle
    ? normalizeCourseTitle(metadataTitle)
    : null;
  const pastedTitle = firstMeaningfulLine(pastedDetails);
  const normalizedPasted = pastedTitle ? normalizeCourseTitle(pastedTitle) : null;

  if (
    normalizedParsed &&
    looksLikeCourseTitle(normalizedParsed) &&
    !looksLikeMarketingSentence(normalizedParsed)
  ) {
    return normalizedParsed;
  }

  if (normalizedMetadata && looksLikeCourseTitle(normalizedMetadata)) {
    return normalizedMetadata;
  }

  if (normalizedPasted && looksLikeCourseTitle(normalizedPasted)) {
    return normalizedPasted;
  }

  return normalizedParsed ?? normalizedMetadata ?? normalizedPasted ?? fallbackTitle;
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

function isSectionHeader(line: string) {
  return /^(description|what you'?ll learn|what you will learn|requirements|who this course is for|course content|instructor|created by|taught by)\s*:?\s*$/i.test(
    line.trim(),
  );
}

function extractDescriptionFromText(text: string | undefined) {
  if (!text) {
    return null;
  }

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const descriptionLines: string[] = [];
  let isReadingDescription = false;

  for (const line of lines) {
    const inlineDescription = line.match(/^description\s*:\s*(.+)$/i)?.[1];

    if (inlineDescription) {
      isReadingDescription = true;
      descriptionLines.push(inlineDescription.trim());
      continue;
    }

    if (/^description\s*:?\s*$/i.test(line)) {
      isReadingDescription = true;
      continue;
    }

    if (isReadingDescription && isSectionHeader(line)) {
      break;
    }

    if (isReadingDescription) {
      descriptionLines.push(line);
    }
  }

  if (descriptionLines.length > 0) {
    return descriptionLines.join(" ").replace(/\s+/g, " ").trim();
  }

  return null;
}

function extractLearningOutcomesFromText(text: string | undefined) {
  if (!text) {
    return [];
  }

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const outcomes: string[] = [];
  let isReadingOutcomes = false;

  for (const line of lines) {
    const inlineOutcomes = line.match(
      /^what you(?:'ll| will) learn\s*:\s*(.+)$/i,
    )?.[1];

    if (inlineOutcomes) {
      isReadingOutcomes = true;
      outcomes.push(inlineOutcomes.trim());
      continue;
    }

    if (/^what you(?:'ll| will) learn\s*:?\s*$/i.test(line)) {
      isReadingOutcomes = true;
      continue;
    }

    if (isReadingOutcomes && isSectionHeader(line)) {
      break;
    }

    if (isReadingOutcomes) {
      outcomes.push(line.replace(/^[-*]\s*/, ""));
    }
  }

  return outcomes
    .map((outcome) => outcome.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function compactSentence(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function splitSentences(value: string) {
  return compactSentence(value).match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) ?? [];
}

function isMarketingLine(value: string) {
  return /\b(world'?s|best|most popular|today|ultimate|complete guide|masterclass)\b/i.test(
    value,
  );
}

function removeMarketingOpening(value: string) {
  const sentences = splitSentences(value).map((sentence) => sentence.trim());

  if (sentences.length > 1 && isMarketingLine(sentences[0])) {
    return sentences.slice(1).join(" ").trim();
  }

  return compactSentence(value);
}

function summarizeFromSkills(title: string, skills: string[]) {
  if (skills.length === 0) {
    return `${title} is a portfolio course entry. Review the imported details and personalize the description before publishing.`;
  }

  const topics = skills.slice(0, 6).join(", ");
  return `${title} prepares learners through practical coverage of ${topics}. It focuses on the core concepts and workflows needed to understand the subject and apply it in real scenarios.`;
}

function summarizeShortFromSkills(title: string, skills: string[]) {
  if (skills.length === 0) {
    return `${title} is a portfolio course entry ready for review and personalization.`;
  }

  const topics = skills.slice(0, 3).join(", ");
  return `${title} covers ${topics} with practical, portfolio-ready learning outcomes.`;
}

function fallbackDescription(metadata: CourseUrlMetadata, pastedDetails?: string) {
  if (metadata.description) {
    return removeMarketingOpening(metadata.description);
  }

  const cleanedPastedDetails = normalizePastedDetails(pastedDetails);
  const pastedDescription = extractDescriptionFromText(cleanedPastedDetails);

  if (!pastedDescription) {
    return "A course imported from a public course page. Review and personalize this description before publishing.";
  }

  return removeMarketingOpening(pastedDescription);
}

function fallbackShortDescription({
  description,
  skills,
  title,
}: {
  description: string;
  skills: string[];
  title: string;
}) {
  const firstSentence = description.match(/^.{80,240}?[.!?](?:\s|$)/)?.[0];
  const candidate = compactSentence(firstSentence ?? description);

  if (
    candidate.length >= 90 &&
    candidate.length <= 220 &&
    !isMarketingLine(candidate) &&
    !candidate.toLowerCase().startsWith("instructor:")
  ) {
    return truncate(candidate, 280);
  }

  return truncate(summarizeShortFromSkills(title, skills), 220);
}

function fallbackFullDescription({
  description,
  skills,
  title,
  outcomes,
}: {
  description: string;
  skills: string[];
  title: string;
  outcomes: string[];
}) {
  const cleanedDescription = compactSentence(description);

  if (cleanedDescription.length >= 140) {
    return cleanedDescription;
  }

  const outcomeSentence =
    outcomes.length > 0
      ? `Learning outcomes include ${outcomes.slice(0, 4).join(", ")}.`
      : "";

  return compactSentence(
    `${summarizeFromSkills(title, skills)} ${outcomeSentence}`.trim(),
  );
}

function hasRawCourseLabels(value: string) {
  return /\b(instructor|what you'?ll learn|requirements|who this course is for)\s*:/i.test(
    value,
  );
}

function isUsableDescription(value: string | null): value is string {
  if (!value) {
    return false;
  }

  const cleaned = compactSentence(value);

  return (
    cleaned.length >= 90 &&
    !hasRawCourseLabels(cleaned) &&
    !isMarketingLine(cleaned)
  );
}

function fallbackSuggestion(
  metadata: CourseUrlMetadata,
  pastedDetails?: string,
): CourseUrlSuggestion {
  const cleanedPastedDetails = normalizePastedDetails(pastedDetails);
  const title = chooseBestCourseTitle({
    fallbackTitle: "Imported Course",
    metadataTitle: metadata.title,
    pastedDetails: cleanedPastedDetails,
  });
  const description = fallbackDescription(metadata, pastedDetails);
  const skills = inferSkillsFromText(
    [metadata.title, metadata.description, cleanedPastedDetails]
      .filter(Boolean)
      .join("\n"),
  );
  const outcomes = extractLearningOutcomesFromText(cleanedPastedDetails);
  const fullDescription = fallbackFullDescription({
    description,
    outcomes,
    skills,
    title,
  });

  return {
    certificateUrl: null,
    courseUrl: metadata.canonicalUrl,
    credentialUrl: null,
    fullDescription,
    imageUrl: metadata.imageUrl,
    instructor: cleanInstructorName(
      metadata.instructor ?? extractInstructorFromText(cleanedPastedDetails),
    ),
    progress: 0,
    provider: metadata.provider ?? "Learning Platform",
    shortDescription: fallbackShortDescription({
      description: fullDescription,
      skills,
      title,
    }),
    skills,
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
    const title = chooseBestCourseTitle({
      fallbackTitle: fallback.title,
      metadataTitle: metadata.title,
      parsedTitle: cleanString(parsed.title, 180),
      pastedDetails,
    });
    const parsedSkills = cleanStringArray(parsed.skills, 12);
    const mergedSkills =
      parsedSkills.length > 0
        ? parsedSkills
        : fallback.skills;
    const parsedFullDescription = cleanString(parsed.fullDescription, 5000);
    const outcomes = extractLearningOutcomesFromText(pastedDetails);
    const fullDescription = isUsableDescription(parsedFullDescription)
      ? removeMarketingOpening(parsedFullDescription)
      : fallbackFullDescription({
          description: fallback.fullDescription,
          outcomes,
          skills: mergedSkills,
          title,
        });
    const parsedShortDescription = cleanString(parsed.shortDescription, 280);
    const shortDescription =
      isUsableDescription(parsedShortDescription) &&
      !isMarketingLine(parsedShortDescription)
        ? compactSentence(parsedShortDescription)
        : fallbackShortDescription({
            description: fullDescription,
            skills: mergedSkills,
            title,
          });

    return {
      ...fallback,
      fullDescription,
      shortDescription,
      imageUrl: cleanString(parsed.imageUrl, 800) ?? fallback.imageUrl,
      instructor: cleanInstructorName(
        cleanString(parsed.instructor, 160) ?? fallback.instructor,
      ),
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
