import "server-only";

import { getHuggingFaceSettings } from "@/lib/huggingface";
import {
  generateProjectDescriptionDraft,
  type ProjectDescriptionDraftInput,
} from "@/services/project-description-generator";

export function getAiProjectAssistantStatus() {
  const settings = getHuggingFaceSettings();

  return {
    enabled: settings.enabled,
    model: settings.model,
    reason: settings.reason,
  };
}

export async function createProjectDescriptionSuggestion(
  input: ProjectDescriptionDraftInput,
) {
  return generateProjectDescriptionDraft(input);
}
