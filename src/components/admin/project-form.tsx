"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  Check,
  GitBranch,
  ImagePlus,
  Loader2,
  Save,
  Sparkles,
  Upload,
} from "lucide-react";

import type { FormState } from "@/app/admin/(protected)/projects/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/lib/projects";
import { projectStatusValues } from "@/lib/validations/project";

type ProjectFormProps = {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  defaultValues?: Project;
  submitLabel: string;
};

const statusLabels: Record<string, string> = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
  archived: "Archived",
};

type AiSuggestionResponse = {
  error?: {
    message?: string;
  };
  suggestion?: {
    fullDescription?: string;
    highlights?: string[];
  };
};

type GithubProjectSuggestion = {
  fullDescription: string;
  githubUrl: string;
  highlights: string[];
  liveUrl: string | null;
  problemSolved: string | null;
  role: string | null;
  shortDescription: string;
  slug: string;
  status: string;
  techStack: string[];
  technicalChallenges: string | null;
  title: string;
};

type GithubProjectResponse = {
  error?: {
    message?: string;
  };
  repo?: {
    fullName: string;
    languages: string[];
    readmeFound: boolean;
  };
  suggestion?: GithubProjectSuggestion;
};

type ImageUploadResponse = {
  error?: {
    message?: string;
  };
  uploads?: Array<{
    path: string;
    url: string;
  }>;
};

const suggestionFieldLabels: Array<{
  label: string;
  name: keyof GithubProjectSuggestion;
}> = [
  { label: "Title", name: "title" },
  { label: "Slug", name: "slug" },
  { label: "Short Description", name: "shortDescription" },
  { label: "Full Description", name: "fullDescription" },
  { label: "Tech Stack", name: "techStack" },
  { label: "GitHub URL", name: "githubUrl" },
  { label: "Live URL", name: "liveUrl" },
  { label: "Status", name: "status" },
  { label: "Role", name: "role" },
  { label: "Highlights", name: "highlights" },
  { label: "Problem Solved", name: "problemSolved" },
  { label: "Technical Challenges", name: "technicalChallenges" },
];

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div aria-live="polite" className="mt-1.5" role="alert">
      {errors.map((error) => (
        <p className="text-sm text-red-600 dark:text-red-400" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}

function parseStringList(value: FormDataEntryValue | null): string[] {
  return typeof value === "string"
    ? value
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function setFormFieldValue(
  form: HTMLFormElement,
  name: string,
  value: string,
) {
  const field = form.elements.namedItem(name);

  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement ||
    field instanceof HTMLSelectElement
  ) {
    field.value = value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function getFormFieldValue(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name);

  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement ||
    field instanceof HTMLSelectElement
  ) {
    return field.value;
  }

  return "";
}

function suggestionValueToString(
  value: GithubProjectSuggestion[keyof GithubProjectSuggestion],
) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value ?? "";
}

function compactSuggestionPreview(
  value: GithubProjectSuggestion[keyof GithubProjectSuggestion],
) {
  const text = suggestionValueToString(value);
  return text.length > 220 ? `${text.slice(0, 220).trim()}...` : text;
}

export function ProjectForm({
  action,
  defaultValues,
  submitLabel,
}: ProjectFormProps) {
  const initialState: FormState = {
    error: null,
    fieldErrors: {},
    success: false,
  };

  const [state, formAction, pending] = useActionState(action, initialState);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [aiMessage, setAiMessage] = React.useState<string | null>(null);
  const [aiPending, setAiPending] = React.useState(false);
  const [githubError, setGithubError] = React.useState<string | null>(null);
  const [githubMessage, setGithubMessage] = React.useState<string | null>(null);
  const [githubPending, setGithubPending] = React.useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = React.useState(
    defaultValues?.githubUrl ?? "",
  );
  const [githubRepoName, setGithubRepoName] = React.useState<string | null>(
    null,
  );
  const [githubSuggestion, setGithubSuggestion] =
    React.useState<GithubProjectSuggestion | null>(null);
  const [selectedImageFiles, setSelectedImageFiles] = React.useState<File[]>(
    [],
  );
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = React.useState<string | null>(null);
  const [uploadPending, setUploadPending] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  async function handleGenerateDescription() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const title = formData.get("title");

    setAiError(null);
    setAiMessage(null);

    if (typeof title !== "string" || title.trim().length < 2) {
      setAiError("Add a project title before generating a draft.");
      return;
    }

    setAiPending(true);

    try {
      const response = await fetch("/api/ai/project-description", {
        body: JSON.stringify({
          problemSolved: formData.get("problemSolved"),
          role: formData.get("role"),
          shortDescription: formData.get("shortDescription"),
          techStack: parseStringList(formData.get("techStack")),
          technicalChallenges: formData.get("technicalChallenges"),
          title,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json().catch(() => ({}))) as
        | AiSuggestionResponse
        | undefined;

      if (!response.ok) {
        setAiError(
          payload?.error?.message ??
            "The AI draft could not be generated right now.",
        );
        return;
      }

      const fullDescription = payload?.suggestion?.fullDescription?.trim();
      const highlights = payload?.suggestion?.highlights ?? [];

      if (!fullDescription) {
        setAiError("The AI response did not include a usable draft.");
        return;
      }

      setFormFieldValue(form, "fullDescription", fullDescription);

      if (highlights.length > 0) {
        setFormFieldValue(form, "highlights", highlights.join(", "));
      }

      setAiMessage("AI draft added. Review it before saving.");
    } catch {
      setAiError("The AI draft request failed. Please try again.");
    } finally {
      setAiPending(false);
    }
  }

  async function handleAnalyzeGithubRepo() {
    const repoUrl = githubRepoUrl.trim();

    setGithubError(null);
    setGithubMessage(null);
    setGithubSuggestion(null);
    setGithubRepoName(null);

    if (!repoUrl) {
      setGithubError("Enter a GitHub repository URL.");
      return;
    }

    setGithubPending(true);

    try {
      const response = await fetch("/api/ai/github-project", {
        body: JSON.stringify({ repoUrl }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json().catch(() => ({}))) as
        | GithubProjectResponse
        | undefined;

      if (!response.ok) {
        setGithubError(
          payload?.error?.message ??
            "The GitHub repository could not be analyzed right now.",
        );
        return;
      }

      if (!payload?.suggestion) {
        setGithubError("The AI response did not include usable project fields.");
        return;
      }

      setGithubRepoName(payload.repo?.fullName ?? null);
      setGithubSuggestion(payload.suggestion);
      setGithubMessage("Suggestions ready. Apply the fields you want to use.");
    } catch {
      setGithubError("The GitHub import request failed. Please try again.");
    } finally {
      setGithubPending(false);
    }
  }

  function applyGithubSuggestionField(name: keyof GithubProjectSuggestion) {
    const form = formRef.current;

    if (!form || !githubSuggestion) {
      return;
    }

    setFormFieldValue(
      form,
      name,
      suggestionValueToString(githubSuggestion[name]),
    );
    setGithubMessage(
      `${
        suggestionFieldLabels.find((field) => field.name === name)?.label ??
        "Field"
      } applied.`,
    );
  }

  function applyAllGithubSuggestions() {
    const form = formRef.current;

    if (!form || !githubSuggestion) {
      return;
    }

    for (const { name } of suggestionFieldLabels) {
      setFormFieldValue(
        form,
        name,
        suggestionValueToString(githubSuggestion[name]),
      );
    }

    setGithubMessage("All GitHub suggestions applied. Review before saving.");
  }

  function appendScreenshotUrls(urls: string[]) {
    const form = formRef.current;

    if (!form || urls.length === 0) {
      return;
    }

    const existingScreenshots = parseStringList(
      getFormFieldValue(form, "screenshots"),
    );
    const nextScreenshots = Array.from(
      new Set([...existingScreenshots, ...urls]),
    );

    setFormFieldValue(form, "screenshots", nextScreenshots.join("\n"));

    if (!getFormFieldValue(form, "imageUrl").trim()) {
      setFormFieldValue(form, "imageUrl", urls[0]);
    }
  }

  async function handleUploadProjectImages() {
    setUploadError(null);
    setUploadMessage(null);

    if (selectedImageFiles.length === 0) {
      setUploadError("Choose one or more images to upload.");
      return;
    }

    const formData = new FormData();
    for (const file of selectedImageFiles) {
      formData.append("files", file);
    }

    setUploadPending(true);

    try {
      const response = await fetch("/api/admin/uploads/project-images", {
        body: formData,
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as
        | ImageUploadResponse
        | undefined;

      if (!response.ok) {
        setUploadError(
          payload?.error?.message ?? "Images could not be uploaded right now.",
        );
        return;
      }

      const urls = payload?.uploads?.map((upload) => upload.url) ?? [];

      if (urls.length === 0) {
        setUploadError("Upload completed, but no image URLs were returned.");
        return;
      }

      appendScreenshotUrls(urls);
      setUploadMessage(
        `${urls.length} ${urls.length === 1 ? "image" : "images"} uploaded.`,
      );
      setSelectedImageFiles([]);

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch {
      setUploadError("The image upload request failed. Please try again.");
    } finally {
      setUploadPending(false);
    }
  }

  return (
    <form action={formAction} className="space-y-8" ref={formRef}>
      {/* General error */}
      {state.error ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <section
        aria-labelledby="github-import-title"
        className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60 sm:p-5"
      >
        <h2
          className="text-base font-bold text-zinc-950 dark:text-white"
          id="github-import-title"
        >
          GitHub Import
        </h2>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="mt-4 min-w-0 flex-1 space-y-2">
            <Label htmlFor="githubRepoImportUrl">Repository URL</Label>
            <Input
              id="githubRepoImportUrl"
              onChange={(event) => setGithubRepoUrl(event.target.value)}
              placeholder="https://github.com/owner/repo"
              type="url"
              value={githubRepoUrl}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Suggestions are generated from repository metadata, README, languages, and manifests.
            </p>
          </div>
          <Button
            aria-describedby="github-import-feedback"
            disabled={githubPending || pending}
            onClick={handleAnalyzeGithubRepo}
            type="button"
            variant="secondary"
          >
            {githubPending ? (
              <Loader2 aria-hidden="true" className="animate-spin" size={16} />
            ) : (
              <GitBranch aria-hidden="true" size={16} />
            )}
            {githubPending ? "Analyzing..." : "Analyze Repo"}
          </Button>
        </div>

        <div aria-live="polite" className="mt-3" id="github-import-feedback">
          {githubMessage ? (
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {githubMessage}
            </p>
          ) : null}
          {githubError ? (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {githubError}
            </p>
          ) : null}
        </div>

        {githubSuggestion ? (
          <div className="mt-5 space-y-4">
            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  className="text-sm font-bold text-zinc-950 dark:text-white"
                >
                  Suggested fields
                </h2>
                {githubRepoName ? (
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Source: {githubRepoName}
                  </p>
                ) : null}
              </div>
              <Button
                onClick={applyAllGithubSuggestions}
                size="sm"
                type="button"
              >
                <Check aria-hidden="true" size={16} />
                Apply all
              </Button>
            </div>

            <div className="grid gap-3">
              {suggestionFieldLabels.map((field) => {
                const preview = compactSuggestionPreview(
                  githubSuggestion[field.name],
                );

                if (!preview) {
                  return null;
                }

                return (
                  <div
                    className="grid gap-3 rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-[150px_1fr_auto] sm:items-start"
                    key={field.name}
                  >
                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {field.label}
                    </p>
                    <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                      {preview}
                    </p>
                    <Button
                      onClick={() => applyGithubSuggestionField(field.name)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      Apply
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>

      {/* Basic Information */}
      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          Basic Information
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title" required>
              Title
            </Label>
            <Input
              defaultValue={defaultValues?.title}
              id="title"
              name="title"
              placeholder="My Awesome Project"
              required
            />
            <FieldError errors={state.fieldErrors.title} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" required>
              Slug
            </Label>
            <Input
              defaultValue={defaultValues?.slug}
              id="slug"
              name="slug"
              placeholder="my-awesome-project"
              required
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              URL-friendly identifier. Use lowercase, numbers, and hyphens.
            </p>
            <FieldError errors={state.fieldErrors.slug} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription" required>
            Short Description
          </Label>
          <Textarea
            className="min-h-20"
            defaultValue={defaultValues?.shortDescription}
            id="shortDescription"
            maxLength={240}
            name="shortDescription"
            placeholder="A brief summary of the project (10-240 characters)"
            required
            rows={2}
          />
          <FieldError errors={state.fieldErrors.shortDescription} />
        </div>

        <div className="space-y-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <Label htmlFor="fullDescription">Full Description</Label>
            <Button
              aria-describedby="ai-draft-feedback"
              disabled={aiPending || pending}
              onClick={handleGenerateDescription}
              type="button"
              variant="secondary"
            >
              {aiPending ? (
                <Loader2
                  aria-hidden="true"
                  className="animate-spin"
                  size={16}
                />
              ) : (
                <Sparkles aria-hidden="true" size={16} />
              )}
              {aiPending ? "Generating..." : "Generate with AI"}
            </Button>
          </div>
          <Textarea
            defaultValue={defaultValues?.fullDescription}
            id="fullDescription"
            maxLength={5000}
            name="fullDescription"
            placeholder="Detailed description of the project, what it does, and why it matters..."
            rows={6}
          />
          <div aria-live="polite" id="ai-draft-feedback">
            {aiMessage ? (
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {aiMessage}
              </p>
            ) : null}
            {aiError ? (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {aiError}
              </p>
            ) : null}
          </div>
          <FieldError errors={state.fieldErrors.fullDescription} />
        </div>
      </fieldset>

      {/* Links */}
      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          Links
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              defaultValue={defaultValues?.githubUrl ?? ""}
              id="githubUrl"
              name="githubUrl"
              placeholder="https://github.com/user/repo"
              type="url"
            />
            <FieldError errors={state.fieldErrors.githubUrl} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="liveUrl">Live Demo URL</Label>
            <Input
              defaultValue={defaultValues?.liveUrl ?? ""}
              id="liveUrl"
              name="liveUrl"
              placeholder="https://example.com"
              type="url"
            />
            <FieldError errors={state.fieldErrors.liveUrl} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Thumbnail Image URL</Label>
          <Input
            defaultValue={defaultValues?.imageUrl ?? ""}
            id="imageUrl"
            name="imageUrl"
            placeholder="https://example.com/screenshot.png"
            type="url"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Used on project cards and the hero image. If left empty, the first screenshot is used.
          </p>
          <FieldError errors={state.fieldErrors.imageUrl} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="screenshots">Screenshots / Gallery Images</Label>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label
                className="flex min-h-28 flex-1 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white px-4 py-5 text-center transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-600"
                htmlFor="projectImageUploads"
              >
                <ImagePlus
                  aria-hidden="true"
                  className="mb-2 text-zinc-500 dark:text-zinc-400"
                  size={24}
                />
                <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Choose images
                </span>
                <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  PNG, JPG, WebP, GIF, or AVIF. Max 3.5 MB each.
                </span>
              </label>
              <input
                accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
                className="sr-only"
                id="projectImageUploads"
                multiple
                onChange={(event) =>
                  setSelectedImageFiles(
                    Array.from(event.currentTarget.files ?? []),
                  )
                }
                ref={imageInputRef}
                type="file"
              />
              <Button
                aria-describedby="image-upload-feedback"
                disabled={uploadPending || pending}
                onClick={handleUploadProjectImages}
                type="button"
                variant="secondary"
              >
                {uploadPending ? (
                  <Loader2
                    aria-hidden="true"
                    className="animate-spin"
                    size={16}
                  />
                ) : (
                  <Upload aria-hidden="true" size={16} />
                )}
                {uploadPending ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <div
              aria-live="polite"
              className="mt-3 space-y-1"
              id="image-upload-feedback"
            >
              {selectedImageFiles.length > 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {selectedImageFiles.length}{" "}
                  {selectedImageFiles.length === 1 ? "file" : "files"} selected.
                </p>
              ) : null}
              {uploadMessage ? (
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {uploadMessage}
                </p>
              ) : null}
              {uploadError ? (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {uploadError}
                </p>
              ) : null}
            </div>
          </div>
          <Textarea
            className="min-h-28"
            defaultValue={defaultValues?.screenshots?.join("\n") ?? ""}
            id="screenshots"
            name="screenshots"
            placeholder="https://example.com/screen-1.png&#10;https://example.com/screen-2.png"
            rows={4}
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Add one image URL per line, or separate URLs with commas. These appear as a gallery on the project page.
          </p>
          <FieldError errors={state.fieldErrors.screenshots} />
        </div>
      </fieldset>

      {/* Metadata */}
      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          Metadata
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              defaultValue={defaultValues?.status ?? "planned"}
              id="status"
              name="status"
            >
              {projectStatusValues.map((value) => (
                <option key={value} value={value}>
                  {statusLabels[value]}
                </option>
              ))}
            </Select>
            <FieldError errors={state.fieldErrors.status} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input
              defaultValue={defaultValues?.displayOrder ?? 0}
              id="displayOrder"
              min={0}
              max={9999}
              name="displayOrder"
              type="number"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Lower numbers appear first. Default is 0.
            </p>
            <FieldError errors={state.fieldErrors.displayOrder} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            defaultValue={defaultValues?.role ?? ""}
            id="role"
            name="role"
            placeholder="Full-Stack Developer, Lead Designer, etc."
          />
          <FieldError errors={state.fieldErrors.role} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="techStack">Tech Stack</Label>
          <Input
            defaultValue={defaultValues?.techStack?.join(", ") ?? ""}
            id="techStack"
            name="techStack"
            placeholder="React, TypeScript, Node.js, PostgreSQL"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Comma-separated list of technologies.
          </p>
          <FieldError errors={state.fieldErrors.techStack} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="highlights">Highlights</Label>
          <Input
            defaultValue={defaultValues?.highlights?.join(", ") ?? ""}
            id="highlights"
            name="highlights"
            placeholder="Built from scratch, 10k+ users, Open source"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Comma-separated list of key highlights.
          </p>
          <FieldError errors={state.fieldErrors.highlights} />
        </div>

        <div className="flex items-center gap-3">
          <input
            className="size-4 cursor-pointer rounded border-zinc-300 text-zinc-950 accent-zinc-950 focus:ring-zinc-950 dark:accent-white"
            defaultChecked={defaultValues?.featured ?? false}
            id="featured"
            name="featured"
            type="checkbox"
          />
          <Label className="cursor-pointer" htmlFor="featured">
            Featured project
          </Label>
        </div>
      </fieldset>

      {/* Extended Details */}
      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          Extended Details
          <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
            (optional)
          </span>
        </legend>

        <div className="space-y-2">
          <Label htmlFor="problemSolved">Problem Solved</Label>
          <Textarea
            defaultValue={defaultValues?.problemSolved ?? ""}
            id="problemSolved"
            name="problemSolved"
            placeholder="What problem does this project solve?"
            rows={3}
          />
          <FieldError errors={state.fieldErrors.problemSolved} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="technicalChallenges">Technical Challenges</Label>
          <Textarea
            defaultValue={defaultValues?.technicalChallenges ?? ""}
            id="technicalChallenges"
            name="technicalChallenges"
            placeholder="What technical challenges were faced and how were they overcome?"
            rows={3}
          />
          <FieldError errors={state.fieldErrors.technicalChallenges} />
        </div>
      </fieldset>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Button disabled={pending} size="lg" type="submit">
          <Save aria-hidden="true" size={18} />
          {pending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
