"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/auth";
import { updateSiteSettings } from "@/lib/site-settings";
import { siteSettingsSchema } from "@/lib/validations/site-settings";

export type SiteSettingsFormState = {
  error: string | null;
  fieldErrors: Record<string, string[]>;
  success: boolean;
};

function parseStringList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formDataToSiteSettingsInput(formData: FormData) {
  return {
    siteName: (formData.get("siteName") as string) || "",
    heroEyebrow: (formData.get("heroEyebrow") as string) || "",
    heroTitle: (formData.get("heroTitle") as string) || "",
    heroIntro: (formData.get("heroIntro") as string) || "",
    primaryCtaLabel: (formData.get("primaryCtaLabel") as string) || "",
    secondaryCtaLabel: (formData.get("secondaryCtaLabel") as string) || "",
    aboutTitle: (formData.get("aboutTitle") as string) || "",
    aboutSummary: (formData.get("aboutSummary") as string) || "",
    skillsTitle: (formData.get("skillsTitle") as string) || "",
    skillsSummary: (formData.get("skillsSummary") as string) || "",
    skills: parseStringList((formData.get("skills") as string) || ""),
    contactTitle: (formData.get("contactTitle") as string) || "",
    contactSummary: (formData.get("contactSummary") as string) || "",
    contactEmail: (formData.get("contactEmail") as string) || "",
    githubUrl: (formData.get("githubUrl") as string) || "",
    linkedinUrl: (formData.get("linkedinUrl") as string) || "",
    resumeUrl: (formData.get("resumeUrl") as string) || "",
  };
}

export async function updateSiteSettingsAction(
  _prevState: SiteSettingsFormState,
  formData: FormData,
): Promise<SiteSettingsFormState> {
  await requireAdminSession();

  const raw = formDataToSiteSettingsInput(formData);
  const result = siteSettingsSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0]?.toString() ?? "_root";
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }

    return {
      error: "Please fix the errors below.",
      fieldErrors,
      success: false,
    };
  }

  try {
    await updateSiteSettings(result.data);
  } catch {
    return {
      error: "Site settings could not be saved. Please try again.",
      fieldErrors: {},
      success: false,
    };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?success=settings");
}
