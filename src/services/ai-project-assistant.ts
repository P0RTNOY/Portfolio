import "server-only";

import { getHuggingFaceSettings } from "@/lib/huggingface";
import type { GithubRepoContext } from "@/lib/github-repo";
import { generateGithubProjectSuggestion } from "@/services/github-project-suggester";
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

export async function createGithubProjectSuggestion(repo: GithubRepoContext) {
  return generateGithubProjectSuggestion(repo);
}
