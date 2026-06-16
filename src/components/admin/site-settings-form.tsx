"use client";

import * as React from "react";
import { useActionState } from "react";
import { Save } from "lucide-react";

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

  return (
    <form action={formAction} className="space-y-8">
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

          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input
              defaultValue={settings.resumeUrl ?? ""}
              id="resumeUrl"
              name="resumeUrl"
              placeholder="https://example.com/resume.pdf"
              type="url"
            />
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
