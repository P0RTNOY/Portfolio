"use client";

import * as React from "react";
import { useActionState } from "react";
import { Check, Loader2, Save, Sparkles } from "lucide-react";

import type { CourseFormState } from "@/app/admin/(protected)/courses/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Course } from "@/lib/courses";
import { courseStatusValues } from "@/lib/validations/course";

type CourseFormProps = {
  action: (
    prevState: CourseFormState,
    formData: FormData,
  ) => Promise<CourseFormState>;
  defaultValues?: Course;
  submitLabel: string;
};

type CourseUrlSuggestion = {
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
  status: string;
  title: string;
};

type CourseUrlResponse = {
  aiWarning?: string;
  error?: {
    message?: string;
  };
  metadata?: {
    title?: string | null;
  };
  suggestion?: CourseUrlSuggestion;
};

const initialState: CourseFormState = {
  error: null,
  fieldErrors: {},
  success: false,
};

const statusLabels: Record<string, string> = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
  archived: "Archived",
};

const suggestionFieldLabels: Array<{
  label: string;
  name: keyof CourseUrlSuggestion;
}> = [
  { label: "Title", name: "title" },
  { label: "Slug", name: "slug" },
  { label: "Provider", name: "provider" },
  { label: "Course URL", name: "courseUrl" },
  { label: "Image URL", name: "imageUrl" },
  { label: "Short Description", name: "shortDescription" },
  { label: "Full Description", name: "fullDescription" },
  { label: "Skills", name: "skills" },
  { label: "Instructor", name: "instructor" },
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

function formatDateValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : "";
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

function suggestionValueToString(
  value: CourseUrlSuggestion[keyof CourseUrlSuggestion],
) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "number") {
    return String(value);
  }

  return value ?? "";
}

function compactSuggestionPreview(
  value: CourseUrlSuggestion[keyof CourseUrlSuggestion],
) {
  const text = suggestionValueToString(value);
  return text.length > 220 ? `${text.slice(0, 220).trim()}...` : text;
}

export function CourseForm({
  action,
  defaultValues,
  submitLabel,
}: CourseFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [courseUrl, setCourseUrl] = React.useState(
    defaultValues?.courseUrl ?? "",
  );
  const [pastedDetails, setPastedDetails] = React.useState("");
  const [importError, setImportError] = React.useState<string | null>(null);
  const [importMessage, setImportMessage] = React.useState<string | null>(null);
  const [importPending, setImportPending] = React.useState(false);
  const [sourceTitle, setSourceTitle] = React.useState<string | null>(null);
  const [suggestion, setSuggestion] =
    React.useState<CourseUrlSuggestion | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleImportCourseUrl() {
    const trimmedUrl = courseUrl.trim();

    setImportError(null);
    setImportMessage(null);
    setSuggestion(null);
    setSourceTitle(null);

    if (!trimmedUrl) {
      setImportError("Enter a course URL to import.");
      return;
    }

    setImportPending(true);

    try {
      const response = await fetch("/api/ai/course-url", {
        body: JSON.stringify({
          courseUrl: trimmedUrl,
          pastedDetails: pastedDetails.trim() || undefined,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as
        | CourseUrlResponse
        | undefined;

      if (!response.ok) {
        setImportError(
          payload?.error?.message ??
            "The course URL could not be imported right now.",
        );
        return;
      }

      if (!payload?.suggestion) {
        setImportError("The importer did not return usable course fields.");
        return;
      }

      setSuggestion(payload.suggestion);
      setSourceTitle(payload.metadata?.title ?? payload.suggestion.title);
      setImportMessage(
        payload.aiWarning
          ? `Metadata imported. AI fallback note: ${payload.aiWarning}`
          : "Suggestions ready. Apply the fields you want to use.",
      );
    } catch {
      setImportError("The course import request failed. Please try again.");
    } finally {
      setImportPending(false);
    }
  }

  function applySuggestionField(name: keyof CourseUrlSuggestion) {
    const form = formRef.current;

    if (!form || !suggestion) {
      return;
    }

    setFormFieldValue(form, name, suggestionValueToString(suggestion[name]));
    setImportMessage(
      `${
        suggestionFieldLabels.find((field) => field.name === name)?.label ??
        "Field"
      } applied.`,
    );
  }

  function applyAllSuggestions() {
    const form = formRef.current;

    if (!form || !suggestion) {
      return;
    }

    for (const { name } of suggestionFieldLabels) {
      setFormFieldValue(form, name, suggestionValueToString(suggestion[name]));
    }

    setImportMessage("All course suggestions applied. Review before saving.");
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

      <section
        aria-labelledby="course-import-title"
        className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60 sm:p-5"
      >
        <h2
          className="text-base font-bold text-zinc-950 dark:text-white"
          id="course-import-title"
        >
          Course URL Import
        </h2>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="mt-4 min-w-0 flex-1 space-y-2">
            <Label htmlFor="courseUrlImport">Course URL</Label>
            <Input
              id="courseUrlImport"
              onChange={(event) => setCourseUrl(event.target.value)}
              placeholder="https://www.udemy.com/course/securityplus/"
              type="url"
              value={courseUrl}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Paste a URL, and optionally paste the Udemy course description below for stronger suggestions.
            </p>
          </div>
          <Button
            aria-describedby="course-import-feedback"
            disabled={importPending || pending}
            onClick={handleImportCourseUrl}
            type="button"
            variant="secondary"
          >
            {importPending ? (
              <Loader2 aria-hidden="true" className="animate-spin" size={16} />
            ) : (
              <Sparkles aria-hidden="true" size={16} />
            )}
            {importPending ? "Importing..." : "Import Course"}
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor="coursePastedDetails">
            Course details / description
          </Label>
          <Textarea
            id="coursePastedDetails"
            maxLength={12000}
            onChange={(event) => setPastedDetails(event.target.value)}
            placeholder="Paste the Udemy title, description, what you'll learn, requirements, instructor, or course overview here."
            rows={6}
            value={pastedDetails}
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Helpful for Udemy pages that block server-side metadata access. The pasted text is used only server-side for this suggestion request.
          </p>
        </div>

        <div aria-live="polite" className="mt-3" id="course-import-feedback">
          {importMessage ? (
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {importMessage}
            </p>
          ) : null}
          {importError ? (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {importError}
            </p>
          ) : null}
        </div>

        {suggestion ? (
          <div className="mt-5 space-y-4">
            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Suggested fields
                </h3>
                {sourceTitle ? (
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Source: {sourceTitle}
                  </p>
                ) : null}
              </div>
              <Button onClick={applyAllSuggestions} size="sm" type="button">
                <Check aria-hidden="true" size={16} />
                Apply all
              </Button>
            </div>

            <div className="grid gap-3">
              {suggestionFieldLabels.map((field) => {
                const preview = compactSuggestionPreview(
                  suggestion[field.name],
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
                      onClick={() => applySuggestionField(field.name)}
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

      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          Course Details
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
              placeholder="security-plus-bootcamp"
              required
            />
            <FieldError errors={state.fieldErrors.slug} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="provider" required>
              Provider
            </Label>
            <Input
              defaultValue={defaultValues?.provider ?? "Udemy"}
              id="provider"
              name="provider"
              required
            />
            <FieldError errors={state.fieldErrors.provider} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              defaultValue={defaultValues?.instructor ?? ""}
              id="instructor"
              name="instructor"
            />
            <FieldError errors={state.fieldErrors.instructor} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription" required>
            Short Description
          </Label>
          <Textarea
            defaultValue={defaultValues?.shortDescription}
            id="shortDescription"
            maxLength={280}
            name="shortDescription"
            required
            rows={2}
          />
          <FieldError errors={state.fieldErrors.shortDescription} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullDescription">Full Description</Label>
          <Textarea
            defaultValue={defaultValues?.fullDescription}
            id="fullDescription"
            maxLength={5000}
            name="fullDescription"
            rows={6}
          />
          <FieldError errors={state.fieldErrors.fullDescription} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Skills / Topics</Label>
          <Input
            defaultValue={defaultValues?.skills.join(", ")}
            id="skills"
            name="skills"
            placeholder="Security, Networking, Risk Management"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Comma-separated list used for public course tags.
          </p>
          <FieldError errors={state.fieldErrors.skills} />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          Progress
        </legend>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="status" required>
              Status
            </Label>
            <Select
              defaultValue={defaultValues?.status ?? "planned"}
              id="status"
              name="status"
            >
              {courseStatusValues.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </Select>
            <FieldError errors={state.fieldErrors.status} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress" required>
              Progress
            </Label>
            <Input
              defaultValue={defaultValues?.progress ?? 0}
              id="progress"
              max={100}
              min={0}
              name="progress"
              required
              type="number"
            />
            <FieldError errors={state.fieldErrors.progress} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder" required>
              Display Order
            </Label>
            <Input
              defaultValue={defaultValues?.displayOrder ?? 0}
              id="displayOrder"
              min={0}
              name="displayOrder"
              required
              type="number"
            />
            <FieldError errors={state.fieldErrors.displayOrder} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startedAt">Started Date</Label>
            <Input
              defaultValue={formatDateValue(defaultValues?.startedAt)}
              id="startedAt"
              name="startedAt"
              type="date"
            />
            <FieldError errors={state.fieldErrors.startedAt} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="completedAt">Completed Date</Label>
            <Input
              defaultValue={formatDateValue(defaultValues?.completedAt)}
              id="completedAt"
              name="completedAt"
              type="date"
            />
            <FieldError errors={state.fieldErrors.completedAt} />
          </div>
        </div>

        <label className="flex min-h-11 items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
          <input
            className="size-4 rounded border-zinc-300 text-zinc-950"
            defaultChecked={defaultValues?.featured ?? false}
            name="featured"
            type="checkbox"
          />
          Feature this course on the homepage
        </label>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-bold text-zinc-950 dark:text-white">
          Links & Media
        </legend>

        <div className="space-y-2">
          <Label htmlFor="courseUrl" required>
            Course URL
          </Label>
          <Input
            defaultValue={defaultValues?.courseUrl}
            id="courseUrl"
            name="courseUrl"
            placeholder="https://www.udemy.com/course/securityplus/"
            required
            type="url"
          />
          <FieldError errors={state.fieldErrors.courseUrl} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            defaultValue={defaultValues?.imageUrl ?? ""}
            id="imageUrl"
            name="imageUrl"
            placeholder="https://example.com/course-image.jpg"
            type="url"
          />
          <FieldError errors={state.fieldErrors.imageUrl} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="certificateUrl">Certificate URL</Label>
            <Input
              defaultValue={defaultValues?.certificateUrl ?? ""}
              id="certificateUrl"
              name="certificateUrl"
              type="url"
            />
            <FieldError errors={state.fieldErrors.certificateUrl} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credentialUrl">Credential URL</Label>
            <Input
              defaultValue={defaultValues?.credentialUrl ?? ""}
              id="credentialUrl"
              name="credentialUrl"
              type="url"
            />
            <FieldError errors={state.fieldErrors.credentialUrl} />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Button disabled={pending} size="lg" type="submit">
          {pending ? (
            <Loader2 aria-hidden="true" className="animate-spin" size={18} />
          ) : (
            <Save aria-hidden="true" size={18} />
          )}
          {pending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
