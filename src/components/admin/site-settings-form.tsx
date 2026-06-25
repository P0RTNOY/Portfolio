"use client";

import * as React from "react";
import { useActionState } from "react";
import { FileText, Loader2, Save, Sparkles, Upload } from "lucide-react";

import type { SiteSettingsFormState } from "@/app/admin/(protected)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSettings } from "@/lib/site-settings";

type SiteSettingsFormProps = {
  action: (
    prevState: SiteSettingsFormState,
    formData: FormData,
  ) => Promise<SiteSettingsFormState>;
  settings: SiteSettings;
};

const initialState: SiteSettingsFormState = {
  error: null,
  fieldErrors: {},
  success: false,
};

type ResumeUploadResponse = {
  error?: {
    message?: string;
  };
  upload?: {
    path: string;
    url: string;
  };
};

type CvSiteContentSuggestion = {
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

type CvSiteContentResponse = {
  aiWarning?: string;
  error?: {
    message?: string;
  };
  extractedCharacters?: number;
  suggestion?: CvSiteContentSuggestion;
};

const cvSuggestionFields: Array<keyof CvSiteContentSuggestion> = [
  "siteName",
  "heroEyebrow",
  "heroTitle",
  "heroIntro",
  "primaryCtaLabel",
  "secondaryCtaLabel",
  "aboutTitle",
  "aboutSummary",
  "skillsTitle",
  "skillsSummary",
  "skills",
  "contactTitle",
  "contactSummary",
  "contactEmail",
  "githubUrl",
  "linkedinUrl",
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

export function SiteSettingsForm({
  action,
  settings,
}: SiteSettingsFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [selectedResumeFile, setSelectedResumeFile] =
    React.useState<File | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = React.useState<string | null>(null);
  const [uploadPending, setUploadPending] = React.useState(false);
  const [cvAiError, setCvAiError] = React.useState<string | null>(null);
  const [cvAiMessage, setCvAiMessage] = React.useState<string | null>(null);
  const [cvAiPending, setCvAiPending] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const resumeInputRef = React.useRef<HTMLInputElement>(null);

  function setFormFieldValue(name: string, value: string) {
    const field = formRef.current?.elements.namedItem(name);

    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    ) {
      field.value = value;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function getFormFieldValue(name: string) {
    const field = formRef.current?.elements.namedItem(name);

    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    ) {
      return field.value.trim();
    }

    return "";
  }

  function setResumeUrl(value: string) {
    setFormFieldValue("resumeUrl", value);
  }

  function applyCvSuggestion(suggestion: CvSiteContentSuggestion) {
    for (const field of cvSuggestionFields) {
      const value = suggestion[field];

      if (Array.isArray(value)) {
        setFormFieldValue(field, value.join(", "));
      } else if (typeof value === "string" && value.trim()) {
        setFormFieldValue(field, value);
      }
    }
  }

  async function handleUploadResume() {
    setUploadError(null);
    setUploadMessage(null);

    if (!selectedResumeFile) {
      setUploadError("Choose a PDF resume to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedResumeFile);
    setUploadPending(true);

    try {
      const response = await fetch("/api/admin/uploads/resume", {
        body: formData,
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as
        | ResumeUploadResponse
        | undefined;

      if (!response.ok) {
        setUploadError(
          payload?.error?.message ?? "Resume could not be uploaded right now.",
        );
        return;
      }

      const url = payload?.upload?.url;

      if (!url) {
        setUploadError("Upload completed, but no resume URL was returned.");
        return;
      }

      setResumeUrl(url);
      setUploadMessage("Resume uploaded. Save site content to publish it.");
      setSelectedResumeFile(null);

      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }
    } catch {
      setUploadError("The resume upload request failed. Please try again.");
    } finally {
      setUploadPending(false);
    }
  }

  async function handleGenerateFromCv() {
    const resumeUrl = getFormFieldValue("resumeUrl");

    setCvAiError(null);
    setCvAiMessage(null);

    if (!resumeUrl) {
      setCvAiError("Upload a PDF resume or paste a resume URL first.");
      return;
    }

    setCvAiPending(true);

    try {
      const response = await fetch("/api/ai/site-content-from-cv", {
        body: JSON.stringify({ resumeUrl }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as
        | CvSiteContentResponse
        | undefined;

      if (!response.ok) {
        setCvAiError(
          payload?.error?.message ??
            "Site content could not be generated from this resume.",
        );
        return;
      }

      if (!payload?.suggestion) {
        setCvAiError("The AI response did not include usable site content.");
        return;
      }

      applyCvSuggestion(payload.suggestion);
      const characterCount = payload.extractedCharacters
        ? `${payload.extractedCharacters.toLocaleString()} extracted characters`
        : "the uploaded CV";
      setCvAiMessage(
        payload.aiWarning
          ? `Fields filled from CV fallback. AI note: ${payload.aiWarning}`
          : `Fields filled from ${characterCount}. Review and save site content to publish.`,
      );
    } catch {
      setCvAiError("The CV generation request failed. Please try again.");
    } finally {
      setCvAiPending(false);
    }
  }

  return (
    <form action={formAction} className="space-y-8" ref={formRef}>
      {state.error ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          Site identity
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="siteName" required>
              Site name
            </Label>
            <Input
              defaultValue={settings.siteName}
              id="siteName"
              maxLength={80}
              name="siteName"
              required
            />
            <FieldError errors={state.fieldErrors.siteName} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroEyebrow" required>
              Hero eyebrow
            </Label>
            <Input
              defaultValue={settings.heroEyebrow}
              id="heroEyebrow"
              maxLength={80}
              name="heroEyebrow"
              required
            />
            <FieldError errors={state.fieldErrors.heroEyebrow} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          Hero
        </legend>

        <div className="space-y-2">
          <Label htmlFor="heroTitle" required>
            Hero title
          </Label>
          <Textarea
            className="min-h-24"
            defaultValue={settings.heroTitle}
            id="heroTitle"
            maxLength={160}
            name="heroTitle"
            required
            rows={2}
          />
          <FieldError errors={state.fieldErrors.heroTitle} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroIntro" required>
            Hero intro
          </Label>
          <Textarea
            defaultValue={settings.heroIntro}
            id="heroIntro"
            maxLength={360}
            name="heroIntro"
            required
            rows={4}
          />
          <FieldError errors={state.fieldErrors.heroIntro} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="primaryCtaLabel" required>
              Primary CTA label
            </Label>
            <Input
              defaultValue={settings.primaryCtaLabel}
              id="primaryCtaLabel"
              maxLength={40}
              name="primaryCtaLabel"
              required
            />
            <FieldError errors={state.fieldErrors.primaryCtaLabel} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryCtaLabel" required>
              Secondary CTA label
            </Label>
            <Input
              defaultValue={settings.secondaryCtaLabel}
              id="secondaryCtaLabel"
              maxLength={40}
              name="secondaryCtaLabel"
              required
            />
            <FieldError errors={state.fieldErrors.secondaryCtaLabel} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          About
        </legend>

        <div className="space-y-2">
          <Label htmlFor="aboutTitle" required>
            About title
          </Label>
          <Input
            defaultValue={settings.aboutTitle}
            id="aboutTitle"
            maxLength={160}
            name="aboutTitle"
            required
          />
          <FieldError errors={state.fieldErrors.aboutTitle} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aboutSummary" required>
            About summary
          </Label>
          <Textarea
            defaultValue={settings.aboutSummary}
            id="aboutSummary"
            maxLength={900}
            name="aboutSummary"
            required
            rows={5}
          />
          <FieldError errors={state.fieldErrors.aboutSummary} />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          Skills
        </legend>

        <div className="space-y-2">
          <Label htmlFor="skillsTitle" required>
            Skills title
          </Label>
          <Input
            defaultValue={settings.skillsTitle}
            id="skillsTitle"
            maxLength={120}
            name="skillsTitle"
            required
          />
          <FieldError errors={state.fieldErrors.skillsTitle} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skillsSummary" required>
            Skills summary
          </Label>
          <Textarea
            defaultValue={settings.skillsSummary}
            id="skillsSummary"
            maxLength={360}
            name="skillsSummary"
            required
            rows={3}
          />
          <FieldError errors={state.fieldErrors.skillsSummary} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills" required>
            Skills
          </Label>
          <Input
            defaultValue={settings.skills.join(", ")}
            id="skills"
            name="skills"
            placeholder="Frontend, Backend, Design Systems"
            required
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Comma-separated list. Keep each skill short for clean wrapping.
          </p>
          <FieldError errors={state.fieldErrors.skills} />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          Contact
        </legend>

        <div className="space-y-2">
          <Label htmlFor="contactTitle" required>
            Contact title
          </Label>
          <Input
            defaultValue={settings.contactTitle}
            id="contactTitle"
            maxLength={120}
            name="contactTitle"
            required
          />
          <FieldError errors={state.fieldErrors.contactTitle} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactSummary" required>
            Contact summary
          </Label>
          <Textarea
            defaultValue={settings.contactSummary}
            id="contactSummary"
            maxLength={360}
            name="contactSummary"
            required
            rows={3}
          />
          <FieldError errors={state.fieldErrors.contactSummary} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail" required>
            Contact email
          </Label>
          <Input
            defaultValue={settings.contactEmail}
            id="contactEmail"
            maxLength={160}
            name="contactEmail"
            required
            type="email"
          />
          <FieldError errors={state.fieldErrors.contactEmail} />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              defaultValue={settings.githubUrl ?? ""}
              id="githubUrl"
              name="githubUrl"
              placeholder="https://github.com/user"
              type="url"
            />
            <FieldError errors={state.fieldErrors.githubUrl} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              defaultValue={settings.linkedinUrl ?? ""}
              id="linkedinUrl"
              name="linkedinUrl"
              placeholder="https://linkedin.com/in/user"
              type="url"
            />
            <FieldError errors={state.fieldErrors.linkedinUrl} />
          </div>

          <div className="space-y-2 sm:col-span-3">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label
                  className="flex min-h-24 flex-1 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white px-4 py-5 text-center transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-600"
                  htmlFor="resumeUpload"
                >
                  <FileText
                    aria-hidden="true"
                    className="mb-2 text-zinc-500 dark:text-zinc-400"
                    size={24}
                  />
                  <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                    Choose PDF resume
                  </span>
                  <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    PDF only. Max 4 MB.
                  </span>
                </label>
                <input
                  accept="application/pdf,.pdf"
                  className="sr-only"
                  id="resumeUpload"
                  onChange={(event) =>
                    setSelectedResumeFile(event.currentTarget.files?.[0] ?? null)
                  }
                  ref={resumeInputRef}
                  type="file"
                />
                <Button
                  aria-describedby="resume-upload-feedback"
                  disabled={uploadPending || pending}
                  onClick={handleUploadResume}
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
                  {uploadPending ? "Uploading..." : "Upload PDF"}
                </Button>
              </div>
              <div
                aria-live="polite"
                className="mt-3"
                id="resume-upload-feedback"
              >
                {selectedResumeFile ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Selected: {selectedResumeFile.name}
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
            <Input
              defaultValue={settings.resumeUrl ?? ""}
              id="resumeUrl"
              name="resumeUrl"
              placeholder="https://example.com/resume.pdf"
              type="url"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Uploading fills this URL. Save site content afterward to publish it.
              </p>
              <Button
                aria-describedby="cv-ai-feedback"
                disabled={cvAiPending || pending}
                onClick={handleGenerateFromCv}
                type="button"
                variant="secondary"
              >
                {cvAiPending ? (
                  <Loader2
                    aria-hidden="true"
                    className="animate-spin"
                    size={16}
                  />
                ) : (
                  <Sparkles aria-hidden="true" size={16} />
                )}
                {cvAiPending ? "Reading CV..." : "Generate from CV"}
              </Button>
            </div>
            <div aria-live="polite" id="cv-ai-feedback">
              {cvAiMessage ? (
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {cvAiMessage}
                </p>
              ) : null}
              {cvAiError ? (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {cvAiError}
                </p>
              ) : null}
            </div>
            <FieldError errors={state.fieldErrors.resumeUrl} />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Button disabled={pending} size="lg" type="submit">
          <Save aria-hidden="true" size={18} />
          {pending ? "Saving..." : "Save site content"}
        </Button>
      </div>
    </form>
  );
}
