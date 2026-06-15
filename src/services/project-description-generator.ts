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
      ok: true;
    }
  | {
      code: "AI_DISABLED" | "AI_GENERATION_FAILED";
      error: string;
      ok: false;
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
    "You help write concise portfolio project descriptions.",
    "Keep the output generic, honest, and editable. Do not invent metrics, employers, clients, or personal history.",
    "Write 2 short paragraphs and 3 bullet highlights.",
    "",
    "Project context:",
    ...contextLines,
  ].join("\n");
}

export async function generateProjectDescriptionDraft(
  input: ProjectDescriptionDraftInput,
): Promise<ProjectDescriptionDraftResult> {
  const result = await generateHuggingFaceText({
    maxNewTokens: 420,
    prompt: buildProjectDescriptionPrompt(input),
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

  return {
    draft: result.text,
    ok: true,
  };
}
