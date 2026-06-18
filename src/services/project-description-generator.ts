import "server-only";

import { generateHuggingFaceText } from "@/lib/huggingface";

export type ProjectDescriptionDraftInput = {
  problemSolved?: string | null;
  role?: string | null;
  shortDescription?: string | null;
  techStack?: string[];
  technicalChallenges?: string | null;
  title: string;
};

type ProjectDescriptionDraftResult =
  | {
      draft: string;
      highlights: string[];
      ok: true;
    }
  | {
      code: "AI_DISABLED" | "AI_GENERATION_FAILED";
      error: string;
      ok: false;
    };

const projectDescriptionResponseFormat = {
  json_schema: {
    name: "ProjectDescriptionSuggestion",
    schema: {
      additionalProperties: false,
      properties: {
        fullDescription: {
          type: "string",
        },
        highlights: {
          items: {
            type: "string",
          },
          maxItems: 5,
          minItems: 3,
          type: "array",
        },
      },
      required: ["fullDescription", "highlights"],
      type: "object",
    },
    strict: true,
  },
  type: "json_schema",
};

function compactLine(label: string, value?: string | string[] | null) {
  if (Array.isArray(value)) {
    return value.length > 0 ? `${label}: ${value.join(", ")}` : null;
  }

  return value?.trim() ? `${label}: ${value.trim()}` : null;
}

function buildProjectDescriptionPrompt(input: ProjectDescriptionDraftInput) {
  const contextLines = [
    compactLine("Project title", input.title),
    compactLine("Short description", input.shortDescription),
    compactLine("Role", input.role),
    compactLine("Tech stack", input.techStack),
    compactLine("Problem solved", input.problemSolved),
    compactLine("Technical challenges", input.technicalChallenges),
  ].filter(Boolean);

  return [
    "Create editable portfolio project copy from the context below.",
    "Keep it generic, honest, and professional. Do not invent metrics, employers, clients, timelines, awards, or personal history.",
    "Return valid JSON only, with this exact shape:",
    "{\"fullDescription\":\"Two concise paragraphs as one string.\",\"highlights\":[\"Highlight one\",\"Highlight two\",\"Highlight three\"]}",
    "Each highlight must be short and grounded in the provided context.",
    "",
    "Project context:",
    ...contextLines,
  ].join("\n");
}

function parseJsonSuggestion(text: string) {
  const trimmed = text.trim();
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1));

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const fullDescription = (parsed as { fullDescription?: unknown })
      .fullDescription;
    const highlights = (parsed as { highlights?: unknown }).highlights;

    if (typeof fullDescription !== "string" || !Array.isArray(highlights)) {
      return null;
    }

    return {
      fullDescription: fullDescription.trim(),
      highlights: highlights
        .filter((highlight): highlight is string => typeof highlight === "string")
        .map((highlight) => highlight.trim())
        .filter(Boolean)
        .slice(0, 5),
    };
  } catch {
    return null;
  }
}

export async function generateProjectDescriptionDraft(
  input: ProjectDescriptionDraftInput,
): Promise<ProjectDescriptionDraftResult> {
  const result = await generateHuggingFaceText({
    maxNewTokens: 1000,
    prompt: buildProjectDescriptionPrompt(input),
    responseFormat: projectDescriptionResponseFormat,
    systemPrompt:
      "You write grounded portfolio project copy and return only valid JSON.",
    temperature: 0.65,
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

  const suggestion = parseJsonSuggestion(result.text);

  if (!suggestion?.fullDescription) {
    return {
      code: "AI_GENERATION_FAILED",
      error: "The AI response could not be converted into a project draft.",
      ok: false,
    };
  }

  return {
    draft: suggestion.fullDescription,
    highlights: suggestion.highlights,
    ok: true,
  };
}
