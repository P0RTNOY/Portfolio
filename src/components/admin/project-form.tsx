"use client";

import * as React from "react";
import { useActionState } from "react";
import { Save } from "lucide-react";

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

  return (
    <form action={formAction} className="space-y-8">
      {/* General error */}
      {state.error ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

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
          <Label htmlFor="fullDescription">Full Description</Label>
          <Textarea
            defaultValue={defaultValues?.fullDescription}
            id="fullDescription"
            maxLength={5000}
            name="fullDescription"
            placeholder="Detailed description of the project, what it does, and why it matters..."
            rows={6}
          />
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
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            defaultValue={defaultValues?.imageUrl ?? ""}
            id="imageUrl"
            name="imageUrl"
            placeholder="https://example.com/screenshot.png"
            type="url"
          />
          <FieldError errors={state.fieldErrors.imageUrl} />
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
