import "server-only";

import { PDFParse } from "pdf-parse";

import { generateHuggingFaceText } from "@/lib/huggingface";

const MAX_RESUME_BYTES = 4 * 1024 * 1024;
const MAX_RESUME_TEXT_CHARS = 14000;

export type CvSiteContentSuggestion = {
  aboutSummary: string;
  aboutTitle: string;
  contactEmail: string | null;
  contactSummary: string;
  contactTitle: string;
  githubUrl: string | null;
  heroEyebrow: string;
  heroIntro: string;
  heroTitle: string;
  linkedinUrl: string | null;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  siteName: string;
  skills: string[];
  skillsSummary: string;
  skillsTitle: string;
};

export type CvSiteContentResult = {
  aiWarning?: string;
  extractedCharacters: number;
  suggestion: CvSiteContentSuggestion;
};

class CvImportError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "CV_FETCH_FAILED"
      | "CV_INVALID_PDF"
      | "CV_TEXT_EMPTY"
      | "CV_TOO_LARGE",
  ) {
    super(message);
    this.name = "CvImportError";
  }
}

export { CvImportError };

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  const sliced = value.slice(0, maxLength).trim();
  const lastSpace = sliced.lastIndexOf(" ");

  return lastSpace > Math.floor(maxLength * 0.7)
    ? sliced.slice(0, lastSpace).trim()
    : sliced;
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim()
    ? truncate(cleanText(value), maxLength)
    : null;
}

function cleanStringArray(value: unknown, maxItems: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => cleanText(item))
    .filter(Boolean)
    .slice(0, maxItems);
}

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
}

function extractUrl(text: string, hostPattern: RegExp) {
  const urls = text.match(/https?:\/\/[^\s)>\]]+/gi) ?? [];
  return urls.find((url) => hostPattern.test(url)) ?? null;
}

function extractName(text: string) {
  const firstLines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  return (
    firstLines.find((line) => {
      const words = line.split(/\s+/);
      return (
        words.length >= 2 &&
        words.length <= 4 &&
        line.length <= 80 &&
        /^[A-Z][A-Za-z'.-]+(?:\s+[A-Z][A-Za-z'.-]+)+$/.test(line)
      );
    }) ?? "Portfolio"
  );
}

function inferSkills(text: string) {
  const skillPatterns: Array<[RegExp, string]> = [
    [/react|next\.?js/i, "React / Next.js"],
    [/typescript|javascript/i, "TypeScript"],
    [/node\.?js|express/i, "Node.js"],
    [/python/i, "Python"],
    [/sql|postgres|supabase|sqlite|prisma/i, "Databases"],
    [/aws|azure|gcp|cloud/i, "Cloud"],
    [/docker|kubernetes|ci\/cd|devops/i, "DevOps"],
    [/cybersecurity|security|comptia|siem|soc/i, "Cybersecurity"],
    [/automation|scripting/i, "Automation"],
    [/api|rest|graphql/i, "API Development"],
    [/tailwind|css|html|design system/i, "Frontend UI"],
    [/ai|machine learning|llm|hugging face|openai/i, "AI Integrations"],
  ];

  const skills = skillPatterns
    .filter(([pattern]) => pattern.test(text))
    .map(([, skill]) => skill);

  return skills.length > 0
    ? skills.slice(0, 12)
    : ["Software Development", "Problem Solving", "Technical Learning"];
}

function fallbackSuggestion(text: string): CvSiteContentSuggestion {
  const name = extractName(text);
  const skills = inferSkills(text);
  const email = extractEmail(text);
  const githubUrl = extractUrl(text, /github\.com/i);
  const linkedinUrl = extractUrl(text, /linkedin\.com/i);
  const primarySkill = skills[0] ?? "software development";

  return {
    aboutSummary: `${name} is building a portfolio around ${skills
      .slice(0, 4)
      .join(", ")}. This summary was generated from the uploaded CV and should be reviewed before publishing.`,
    aboutTitle: `About ${name}`,
    contactEmail: email,
    contactSummary:
      "Use the contact details from the CV or update this section with your preferred professional links.",
    contactTitle: "Let's connect",
    githubUrl,
    heroEyebrow: "Portfolio",
    heroIntro: `A portfolio shaped around ${skills
      .slice(0, 3)
      .join(", ")} and practical technical work.`,
    heroTitle: `${name} — ${primarySkill} portfolio`,
    linkedinUrl,
    primaryCtaLabel: "View Projects",
    secondaryCtaLabel: "Contact Me",
    siteName: name,
    skills,
    skillsSummary: `Key areas extracted from the CV include ${skills
      .slice(0, 6)
      .join(", ")}.`,
    skillsTitle: "Core skills",
  };
}

function parseAiSuggestion(text: string, resumeText: string) {
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
    const fallback = fallbackSuggestion(resumeText);
    const skills = cleanStringArray(parsed.skills, 18);

    return {
      aboutSummary:
        cleanString(parsed.aboutSummary, 900) ?? fallback.aboutSummary,
      aboutTitle: cleanString(parsed.aboutTitle, 160) ?? fallback.aboutTitle,
      contactEmail: cleanString(parsed.contactEmail, 160) ?? fallback.contactEmail,
      contactSummary:
        cleanString(parsed.contactSummary, 360) ?? fallback.contactSummary,
      contactTitle:
        cleanString(parsed.contactTitle, 120) ?? fallback.contactTitle,
      githubUrl: cleanString(parsed.githubUrl, 800) ?? fallback.githubUrl,
      heroEyebrow:
        cleanString(parsed.heroEyebrow, 80) ?? fallback.heroEyebrow,
      heroIntro: cleanString(parsed.heroIntro, 360) ?? fallback.heroIntro,
      heroTitle: cleanString(parsed.heroTitle, 160) ?? fallback.heroTitle,
      linkedinUrl:
        cleanString(parsed.linkedinUrl, 800) ?? fallback.linkedinUrl,
      primaryCtaLabel:
        cleanString(parsed.primaryCtaLabel, 40) ?? fallback.primaryCtaLabel,
      secondaryCtaLabel:
        cleanString(parsed.secondaryCtaLabel, 40) ?? fallback.secondaryCtaLabel,
      siteName: cleanString(parsed.siteName, 80) ?? fallback.siteName,
      skills: skills.length > 0 ? skills : fallback.skills,
      skillsSummary:
        cleanString(parsed.skillsSummary, 360) ?? fallback.skillsSummary,
      skillsTitle: cleanString(parsed.skillsTitle, 120) ?? fallback.skillsTitle,
    } satisfies CvSiteContentSuggestion;
  } catch {
    return null;
  }
}

async function extractPdfTextFromUrl(resumeUrl: string) {
  const response = await fetch(resumeUrl, {
    headers: {
      Accept: "application/pdf,application/octet-stream,*/*",
    },
  });

  if (!response.ok) {
    throw new CvImportError(
      `Resume PDF could not be fetched. The server returned HTTP ${response.status}.`,
      "CV_FETCH_FAILED",
    );
  }

  const contentLength = response.headers.get("content-length");

  if (contentLength && Number(contentLength) > MAX_RESUME_BYTES) {
    throw new CvImportError(
      "Resume PDF is larger than 4 MB.",
      "CV_TOO_LARGE",
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  if (buffer.byteLength > MAX_RESUME_BYTES) {
    throw new CvImportError(
      "Resume PDF is larger than 4 MB.",
      "CV_TOO_LARGE",
    );
  }

  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    const text = result.text.trim();

    if (!text) {
      throw new CvImportError(
        "No selectable text was found in the resume PDF. Try uploading a text-based PDF instead of a scanned image.",
        "CV_TEXT_EMPTY",
      );
    }

    return text.slice(0, MAX_RESUME_TEXT_CHARS);
  } catch (error) {
    if (error instanceof CvImportError) {
      throw error;
    }

    throw new CvImportError(
      "Resume PDF text could not be extracted.",
      "CV_INVALID_PDF",
    );
  } finally {
    await parser.destroy();
  }
}

function buildPrompt(resumeText: string) {
  return [
    "You are generating editable site content for a personal portfolio admin form.",
    "Use only the uploaded CV text. Do not invent employers, degrees, certifications, project names, contact links, or achievements that are not present.",
    "Write polished, professional portfolio copy in a confident but not exaggerated tone.",
    "Keep content concise and suitable for a first viewport portfolio page.",
    "Return ONLY valid JSON. No markdown. No commentary.",
    "JSON shape:",
    '{"siteName":"string","heroEyebrow":"string","heroTitle":"string","heroIntro":"string","primaryCtaLabel":"string","secondaryCtaLabel":"string","aboutTitle":"string","aboutSummary":"string","skillsTitle":"string","skillsSummary":"string","skills":["string"],"contactTitle":"string","contactSummary":"string","contactEmail":"string|null","githubUrl":"string|null","linkedinUrl":"string|null"}',
    "Length rules: heroTitle <= 150 chars, heroIntro <= 330 chars, aboutSummary <= 850 chars, skillsSummary <= 330 chars, contactSummary <= 330 chars.",
    "CTA labels should usually be 'View Projects' and 'Contact Me'.",
    "",
    "CV text:",
    "```",
    resumeText,
    "```",
  ].join("\n");
}

export async function generateSiteContentFromCv(
  resumeUrl: string,
): Promise<CvSiteContentResult> {
  const resumeText = await extractPdfTextFromUrl(resumeUrl);
  const fallback = fallbackSuggestion(resumeText);
  const result = await generateHuggingFaceText({
    maxNewTokens: 1800,
    prompt: buildPrompt(resumeText),
    systemPrompt:
      "You are a strict JSON extraction and portfolio copywriting engine.",
    temperature: 0.25,
  });

  if (!result.ok) {
    return {
      aiWarning: result.error,
      extractedCharacters: resumeText.length,
      suggestion: fallback,
    };
  }

  const suggestion = parseAiSuggestion(result.text, resumeText);

  if (!suggestion) {
    return {
      aiWarning: "The AI response could not be converted into site content fields.",
      extractedCharacters: resumeText.length,
      suggestion: fallback,
    };
  }

  return {
    extractedCharacters: resumeText.length,
    suggestion,
  };
}
