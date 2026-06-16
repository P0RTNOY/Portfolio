import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid URL.")
  .optional()
  .or(z.literal("").transform(() => undefined));

const skillListSchema = z
  .array(z.string().trim().min(1).max(80))
  .min(1, "Add at least one skill.")
  .max(24, "Use 24 skills or fewer.");

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(2, "Site name is required.").max(80),
  heroEyebrow: z.string().trim().min(2, "Hero eyebrow is required.").max(80),
  heroTitle: z.string().trim().min(8, "Hero title is required.").max(160),
  heroIntro: z.string().trim().min(20, "Hero intro is required.").max(360),
  primaryCtaLabel: z
    .string()
    .trim()
    .min(2, "Primary button label is required.")
    .max(40),
  secondaryCtaLabel: z
    .string()
    .trim()
    .min(2, "Secondary button label is required.")
    .max(40),
  aboutTitle: z.string().trim().min(8, "About title is required.").max(160),
  aboutSummary: z
    .string()
    .trim()
    .min(20, "About summary is required.")
    .max(900),
  skillsTitle: z.string().trim().min(4, "Skills title is required.").max(120),
  skillsSummary: z
    .string()
    .trim()
    .min(12, "Skills summary is required.")
    .max(360),
  skills: skillListSchema,
  contactTitle: z
    .string()
    .trim()
    .min(4, "Contact title is required.")
    .max(120),
  contactSummary: z
    .string()
    .trim()
    .min(12, "Contact summary is required.")
    .max(360),
  contactEmail: z
    .string()
    .trim()
    .email("Enter a valid contact email.")
    .max(160),
  githubUrl: optionalUrlSchema,
  linkedinUrl: optionalUrlSchema,
  resumeUrl: optionalUrlSchema,
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
