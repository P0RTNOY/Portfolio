"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/auth";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  updateCourse,
} from "@/lib/courses";
import {
  courseCreateSchema,
  courseStatusSchema,
  courseStatusValues,
} from "@/lib/validations/course";

export type CourseFormState = {
  error: string | null;
  fieldErrors: Record<string, string[]>;
  success: boolean;
};

const emptyState: CourseFormState = {
  error: null,
  fieldErrors: {},
  success: false,
};

function parseStringList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalNumberValue(value: FormDataEntryValue | null) {
  const normalized = value?.toString().trim();
  return normalized ? Number(normalized) : undefined;
}

function formDataToCourseInput(formData: FormData) {
  const status = (formData.get("status") as string) || "planned";
  const progress = optionalNumberValue(formData.get("progress"));

  return {
    title: (formData.get("title") as string) || "",
    slug: (formData.get("slug") as string) || "",
    provider: (formData.get("provider") as string) || "Udemy",
    courseUrl: (formData.get("courseUrl") as string) || "",
    imageUrl: (formData.get("imageUrl") as string) || "",
    shortDescription: (formData.get("shortDescription") as string) || "",
    fullDescription: (formData.get("fullDescription") as string) || "",
    skills: parseStringList((formData.get("skills") as string) || ""),
    instructor: (formData.get("instructor") as string) || "",
    status,
    progress: progress ?? (status === "completed" ? 100 : 0),
    certificateUrl: (formData.get("certificateUrl") as string) || "",
    credentialUrl: (formData.get("credentialUrl") as string) || "",
    startedAt: (formData.get("startedAt") as string) || "",
    completedAt: (formData.get("completedAt") as string) || "",
    featured: formData.get("featured") === "on",
    displayOrder: optionalNumberValue(formData.get("displayOrder")) ?? 0,
  };
}

function fieldErrorsFromIssues(
  issues: Array<{ message: string; path: Array<PropertyKey> }>,
) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of issues) {
    const key = issue.path[0]?.toString() ?? "_root";
    if (!fieldErrors[key]) fieldErrors[key] = [];
    fieldErrors[key].push(issue.message);
  }

  return fieldErrors;
}

export async function createCourseAction(
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  await requireAdminSession();

  const raw = formDataToCourseInput(formData);
  const result = courseCreateSchema.safeParse(raw);

  if (!result.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromIssues(result.error.issues),
      success: false,
    };
  }

  try {
    await createCourse(result.data);
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return {
        error: "A course with this slug already exists.",
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

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin");
  revalidatePath("/admin/courses");
  redirect("/admin/courses?success=created");
}

export async function updateCourseAction(
  id: string,
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  await requireAdminSession();

  const existing = await getCourseById(id);

  if (!existing) {
    return { error: "Course not found.", fieldErrors: {}, success: false };
  }

  const raw = formDataToCourseInput(formData);
  const result = courseCreateSchema.safeParse(raw);

  if (!result.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromIssues(result.error.issues),
      success: false,
    };
  }

  try {
    await updateCourse(id, result.data);
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return {
        error: "A course with this slug already exists.",
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

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath(`/courses/${existing.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/courses");
  redirect("/admin/courses?success=updated");
}

export async function deleteCourseAction(id: string): Promise<void> {
  await requireAdminSession();

  await deleteCourse(id);

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin");
  revalidatePath("/admin/courses");
  redirect("/admin/courses?success=deleted");
}

export async function updateCourseStatusAction(
  id: string,
  status: string,
): Promise<CourseFormState> {
  await requireAdminSession();

  const parsed = courseStatusSchema.safeParse(status);

  if (!parsed.success) {
    return {
      error: `Invalid status. Allowed: ${courseStatusValues.join(", ")}`,
      fieldErrors: {},
      success: false,
    };
  }

  try {
    await updateCourse(id, { status: parsed.data });
    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admin/courses");
    return { ...emptyState, success: true };
  } catch {
    return {
      error: "Failed to update status.",
      fieldErrors: {},
      success: false,
    };
  }
}
