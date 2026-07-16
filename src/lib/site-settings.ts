import type { Prisma, SiteSettings as PrismaSiteSettings } from "@prisma/client";

import { DEFAULT_CONTACT_SUMMARY } from "@/lib/cv-copy";
import { getPrisma } from "@/lib/prisma";
import {
  siteSettingsSchema,
  type SiteSettingsInput,
} from "@/lib/validations/site-settings";
import { normalizeRemoteDocumentUrl } from "@/lib/validations/remote-document-url";

const SITE_SETTINGS_ID = "default";

const defaultSiteSettingsInput: SiteSettingsInput = {
  siteName: "Omer Portnoy",
  heroEyebrow: "Junior Software Engineer · Full-Stack / AI / Automation",
  heroTitle:
    "I build practical full-stack software, AI tools, and automation workflows.",
  heroIntro:
    "I'm Omer Portnoy, and this portfolio showcases real products, not templates. I focus on junior SWE readiness through shipped work, steady learning, and clear communication while building backend systems, admin dashboards, LLM-powered apps, developer tools, and automation workflows.",
  primaryCtaLabel: "Explore the platform",
  secondaryCtaLabel: "Contact me",
  aboutTitle: "Software engineer focused on shipping end-to-end products.",
  aboutSummary:
    "I like taking products from idea to deployed software: planning the UI, wiring APIs, working with databases, adding authentication, and shipping something maintainable. I'm building the habits junior software engineering teams look for—clear communication, steady learning, and the discipline to keep improving with every project.",
  skillsTitle: "Technical focus areas that support hiring decisions.",
  skillsSummary:
    "A hiring-focused snapshot of the tools and fundamentals I use to turn ideas into shipped products: frontend and backend work, databases, APIs, authentication, deployment, and the learning habits that help me keep improving.",
  skills: [
    "Python",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "FastAPI",
    "Supabase",
    "PostgreSQL",
    "Prisma",
    "Docker",
    "GCP",
    "REST APIs",
    "AI Integrations",
    "LLM Apps",
    "Hugging Face",
    "OpenAI",
    "Automation",
    "CI/CD",
    "Data Structures",
    "Security Fundamentals",
  ],
  contactTitle: "Open to junior software engineering opportunities.",
  contactSummary: DEFAULT_CONTACT_SUMMARY,
  contactEmail: "omerportnoy@gmail.com",
  githubUrl: "https://github.com/P0RTNOY",
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
    resumeUrl: normalizeRemoteDocumentUrl(settings.resumeUrl),
    skills: parseStringArray(settings.skills),
  };
}

function replaceLegacyDefaultSettings(settings: SiteSettings): SiteSettings {
  const isLegacy = (value: string, legacyValues: string[]) =>
    legacyValues.includes(value);

  return {
    ...settings,
    siteName:
      isLegacy(settings.siteName, ["Portfolio"])
        ? defaultSiteSettingsInput.siteName
        : settings.siteName,
    heroEyebrow:
      isLegacy(settings.heroEyebrow, [
        "Generic portfolio",
        "Software Engineer · AI / Full-Stack / Automation",
      ])
        ? defaultSiteSettingsInput.heroEyebrow
        : settings.heroEyebrow,
    heroTitle:
      isLegacy(settings.heroTitle, [
        "Your Name, professional title, and selected work.",
        "I build practical AI-powered software, full-stack products, and automation tools.",
      ])
        ? defaultSiteSettingsInput.heroTitle
        : settings.heroTitle,
    heroIntro:
      isLegacy(settings.heroIntro, [
        "A concise introduction placeholder for the kind of work, outcomes, and collaborations this portfolio will represent.",
        "I'm Omer Portnoy, a software engineering graduate focused on building real working products - from backend systems and admin dashboards to LLM-powered apps, developer tools, and automation workflows.",
      ])
        ? defaultSiteSettingsInput.heroIntro
        : settings.heroIntro,
    primaryCtaLabel:
      isLegacy(settings.primaryCtaLabel, ["View Projects"])
        ? defaultSiteSettingsInput.primaryCtaLabel
        : settings.primaryCtaLabel,
    secondaryCtaLabel:
      isLegacy(settings.secondaryCtaLabel, ["Contact Me"])
        ? defaultSiteSettingsInput.secondaryCtaLabel
        : settings.secondaryCtaLabel,
    aboutTitle:
      isLegacy(settings.aboutTitle, [
        "A concise professional summary will live here.",
        "Software engineer with a builder mindset.",
      ])
        ? defaultSiteSettingsInput.aboutTitle
        : settings.aboutTitle,
    aboutSummary:
      isLegacy(settings.aboutSummary, [
        "Use this space for a short editable introduction. Keep it focused on the type of work, values, and outcomes you want the portfolio to communicate.",
        "I'm a software engineering graduate who likes building practical systems end-to-end: the frontend people use, the backend that powers it, the database that keeps it reliable, and the tooling that makes it easier to maintain. My current focus is AI-powered products, automation, backend/full-stack development, and learning how to ship software that feels useful, not just technically impressive.",
      ])
        ? defaultSiteSettingsInput.aboutSummary
        : settings.aboutSummary,
    skillsTitle:
      isLegacy(settings.skillsTitle, [
        "Editable skill categories.",
        "Technical focus areas.",
      ])
        ? defaultSiteSettingsInput.skillsTitle
        : settings.skillsTitle,
    skillsSummary:
      isLegacy(settings.skillsSummary, [
        "These categories are generic for now and can be edited from the admin dashboard.",
        "The areas I'm actively building and improving across product engineering, backend systems, AI applications, cloud workflows, and software fundamentals.",
      ])
        ? defaultSiteSettingsInput.skillsSummary
        : settings.skillsSummary,
    skills:
      JSON.stringify(settings.skills) ===
      JSON.stringify([
        "Frontend",
        "Backend",
        "Design Systems",
        "Automation",
        "AI Integrations",
        "Deployment",
      ])
        ? defaultSiteSettingsInput.skills
        : settings.skills,
    contactTitle:
      isLegacy(settings.contactTitle, [
        "Generic contact details.",
        "Let's build something useful.",
      ])
        ? defaultSiteSettingsInput.contactTitle
        : settings.contactTitle,
    contactSummary:
      isLegacy(settings.contactSummary, [
        "Add preferred email, social links, or a contact form once you are ready to personalize the portfolio.",
        "I'm looking for software engineering opportunities where I can contribute, learn fast, and build real products with strong technical foundations.",
      ])
        ? defaultSiteSettingsInput.contactSummary
        : settings.contactSummary,
    contactEmail:
      settings.contactEmail === "hello@example.com"
        ? defaultSiteSettingsInput.contactEmail
        : settings.contactEmail,
    githubUrl: settings.githubUrl ?? defaultSiteSettingsInput.githubUrl ?? null,
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
    return replaceLegacyDefaultSettings(toSiteSettings(existing));
  }

  const created = await prisma.siteSettings.create({
    data: toSiteSettingsCreateData(defaultSiteSettingsInput),
  });

  return replaceLegacyDefaultSettings(toSiteSettings(created));
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
