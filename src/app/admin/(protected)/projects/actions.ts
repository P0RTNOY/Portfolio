"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/auth";
import {
  createProject,
  deleteProject,
  getProjectById,
  updateProject,
} from "@/lib/projects";
import {
  projectCreateSchema,
  projectStatusSchema,
  projectStatusValues,
} from "@/lib/validations/project";

export type FormState = {
  error: string | null;
  fieldErrors: Record<string, string[]>;
  success: boolean;
};

const emptyState: FormState = {
  error: null,
  fieldErrors: {},
  success: false,
};

function parseStringList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formDataToProjectInput(formData: FormData) {
  return {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    shortDescription: formData.get("shortDescription") as string,
    fullDescription: (formData.get("fullDescription") as string) || "",
    techStack: parseStringList((formData.get("techStack") as string) || ""),
    githubUrl: (formData.get("githubUrl") as string) || "",
    liveUrl: (formData.get("liveUrl") as string) || "",
    imageUrl: (formData.get("imageUrl") as string) || "",
    status: (formData.get("status") as string) || "planned",
    featured: formData.get("featured") === "on",
    role: (formData.get("role") as string) || "",
    highlights: parseStringList((formData.get("highlights") as string) || ""),
    problemSolved: (formData.get("problemSolved") as string) || "",
    technicalChallenges:
      (formData.get("technicalChallenges") as string) || "",
    displayOrder: Number(formData.get("displayOrder") || 0),
  };
}

export async function createProjectAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdminSession();

  const raw = formDataToProjectInput(formData);

  const result = projectCreateSchema.safeParse(raw);

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
    await createProject(result.data);
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return {
        error: "A project with this slug already exists.",
        fieldErrors: { slug: ["This slug is already taken."] },
        success: false,
      };
    }

    return {
      error: "Something went wrong. Please try again.",
      fieldErrors: {},
      success: false,
    };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects?success=created");
}

export async function updateProjectAction(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdminSession();

  const existing = await getProjectById(id);

  if (!existing) {
    return { error: "Project not found.", fieldErrors: {}, success: false };
  }

  const raw = formDataToProjectInput(formData);

  const result = projectCreateSchema.safeParse(raw);

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
    await updateProject(id, result.data);
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return {
        error: "A project with this slug already exists.",
        fieldErrors: { slug: ["This slug is already taken."] },
        success: false,
      };
    }

    return {
      error: "Something went wrong. Please try again.",
      fieldErrors: {},
      success: false,
    };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${existing.slug}`);
  redirect("/admin/projects?success=updated");
}

export async function deleteProjectAction(id: string): Promise<void> {
  await requireAdminSession();

  await deleteProject(id);

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects?success=deleted");
}

export async function toggleFeaturedAction(
  id: string,
  featured: boolean,
): Promise<FormState> {
  await requireAdminSession();

  try {
    await updateProject(id, { featured });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { ...emptyState, success: true };
  } catch {
    return {
      error: "Failed to update featured status.",
      fieldErrors: {},
      success: false,
    };
  }
}

export async function updateStatusAction(
  id: string,
  status: string,
): Promise<FormState> {
  await requireAdminSession();

  const parsed = projectStatusSchema.safeParse(status);

  if (!parsed.success) {
    return {
      error: `Invalid status. Allowed: ${projectStatusValues.join(", ")}`,
      fieldErrors: {},
      success: false,
    };
  }

  try {
    await updateProject(id, { status: parsed.data });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { ...emptyState, success: true };
  } catch {
    return {
      error: "Failed to update status.",
      fieldErrors: {},
      success: false,
    };
  }
}
