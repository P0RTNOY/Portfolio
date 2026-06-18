import type { Prisma, SiteSettings as PrismaSiteSettings } from "@prisma/client";

import { getPrisma } from "@/lib/prisma";
import {
  siteSettingsSchema,
  type SiteSettingsInput,
} from "@/lib/validations/site-settings";

const SITE_SETTINGS_ID = "default";

const defaultSiteSettingsInput: SiteSettingsInput = {
  siteName: "Portfolio",
  heroEyebrow: "Generic portfolio",
  heroTitle: "Your Name, professional title, and selected work.",
  heroIntro:
    "A concise introduction placeholder for the kind of work, outcomes, and collaborations this portfolio will represent.",
  primaryCtaLabel: "View Projects",
  secondaryCtaLabel: "Contact Me",
  aboutTitle: "A concise professional summary will live here.",
  aboutSummary:
    "Use this space for a short editable introduction. Keep it focused on the type of work, values, and outcomes you want the portfolio to communicate.",
  skillsTitle: "Editable skill categories.",
  skillsSummary:
    "These categories are generic for now and can be edited from the admin dashboard.",
  skills: [
    "Frontend",
    "Backend",
    "Design Systems",
    "Automation",
    "AI Integrations",
    "Deployment",
  ],
  contactTitle: "Generic contact details.",
  contactSummary:
    "Add preferred email, social links, or a contact form once you are ready to personalize the portfolio.",
  contactEmail: "hello@example.com",
  githubUrl: undefined,
  linkedinUrl: undefined,
  resumeUrl: undefined,
};

export type SiteSettings = Omit<PrismaSiteSettings, "skills"> & {
  skills: string[];
};

function parseStringArray(value: string | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function serializeStringArray(value: string[]) {
  return JSON.stringify(value);
}

function cleanOptionalString(value: string | null | undefined) {
  return value === "" ? null : value;
}

function toSiteSettings(settings: PrismaSiteSettings): SiteSettings {
  return {
    ...settings,
    skills: parseStringArray(settings.skills),
  };
}

function toSiteSettingsCreateData(
  input: SiteSettingsInput,
): Prisma.SiteSettingsCreateInput {
  return {
    id: SITE_SETTINGS_ID,
    siteName: input.siteName,
    heroEyebrow: input.heroEyebrow,
    heroTitle: input.heroTitle,
    heroIntro: input.heroIntro,
    primaryCtaLabel: input.primaryCtaLabel,
    secondaryCtaLabel: input.secondaryCtaLabel,
    aboutTitle: input.aboutTitle,
    aboutSummary: input.aboutSummary,
    skillsTitle: input.skillsTitle,
    skillsSummary: input.skillsSummary,
    skills: serializeStringArray(input.skills),
    contactTitle: input.contactTitle,
    contactSummary: input.contactSummary,
    contactEmail: input.contactEmail,
    githubUrl: cleanOptionalString(input.githubUrl),
    linkedinUrl: cleanOptionalString(input.linkedinUrl),
    resumeUrl: cleanOptionalString(input.resumeUrl),
  };
}

function toSiteSettingsUpdateData(
  input: SiteSettingsInput,
): Prisma.SiteSettingsUpdateInput {
  return {
    siteName: input.siteName,
    heroEyebrow: input.heroEyebrow,
    heroTitle: input.heroTitle,
    heroIntro: input.heroIntro,
    primaryCtaLabel: input.primaryCtaLabel,
    secondaryCtaLabel: input.secondaryCtaLabel,
    aboutTitle: input.aboutTitle,
    aboutSummary: input.aboutSummary,
    skillsTitle: input.skillsTitle,
    skillsSummary: input.skillsSummary,
    skills: serializeStringArray(input.skills),
    contactTitle: input.contactTitle,
    contactSummary: input.contactSummary,
    contactEmail: input.contactEmail,
    githubUrl: cleanOptionalString(input.githubUrl),
    linkedinUrl: cleanOptionalString(input.linkedinUrl),
    resumeUrl: cleanOptionalString(input.resumeUrl),
  };
}

export function getDefaultSiteSettingsInput() {
  return defaultSiteSettingsInput;
}

export async function getSiteSettings() {
  const prisma = getPrisma();
  const existing = await prisma.siteSettings.findUnique({
    where: { id: SITE_SETTINGS_ID },
  });

  if (existing) {
    return toSiteSettings(existing);
  }

  const created = await prisma.siteSettings.create({
    data: toSiteSettingsCreateData(defaultSiteSettingsInput),
  });

  return toSiteSettings(created);
}

export async function updateSiteSettings(input: SiteSettingsInput) {
  const prisma = getPrisma();
  const data = siteSettingsSchema.parse(input);
  const updated = await prisma.siteSettings.upsert({
    create: toSiteSettingsCreateData(data),
    update: toSiteSettingsUpdateData(data),
    where: { id: SITE_SETTINGS_ID },
  });

  return toSiteSettings(updated);
}
