import type { Course as PrismaCourse, Prisma } from "@prisma/client";

import { getPrisma } from "@/lib/prisma";
import {
  courseCreateSchema,
  courseStatusSchema,
  courseUpdateSchema,
  type CourseCreateInput,
  type CourseStatus,
  type CourseUpdateInput,
} from "@/lib/validations/course";

export type Course = Omit<PrismaCourse, "skills" | "status"> & {
  skills: string[];
  status: CourseStatus;
};

type CourseListOptions = {
  featured?: boolean;
  status?: CourseStatus;
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

function serializeStringArray(value: string[] | undefined): string | undefined {
  return value ? JSON.stringify(value) : undefined;
}

function cleanOptionalString(value: string | null | undefined) {
  return value === "" ? null : value;
}

function cleanOptionalDate(value: string | null | undefined) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function toCourse(course: PrismaCourse): Course {
  return {
    ...course,
    skills: parseStringArray(course.skills),
    status: courseStatusSchema.catch("planned").parse(course.status),
  };
}

function toCourseCreateData(input: CourseCreateInput): Prisma.CourseCreateInput {
  return {
    title: input.title,
    slug: input.slug,
    provider: input.provider,
    courseUrl: input.courseUrl,
    imageUrl: cleanOptionalString(input.imageUrl),
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription ?? "",
    skills: serializeStringArray(input.skills) ?? "[]",
    instructor: cleanOptionalString(input.instructor),
    status: input.status ?? "planned",
    progress: input.progress ?? 0,
    certificateUrl: cleanOptionalString(input.certificateUrl),
    credentialUrl: cleanOptionalString(input.credentialUrl),
    startedAt: cleanOptionalDate(input.startedAt),
    completedAt: cleanOptionalDate(input.completedAt),
    featured: input.featured ?? false,
    displayOrder: input.displayOrder ?? 0,
  };
}

function toCourseUpdateData(input: CourseUpdateInput): Prisma.CourseUpdateInput {
  return {
    title: input.title,
    slug: input.slug,
    provider: input.provider,
    courseUrl: input.courseUrl,
    imageUrl: cleanOptionalString(input.imageUrl),
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    skills: serializeStringArray(input.skills),
    instructor: cleanOptionalString(input.instructor),
    status: input.status,
    progress: input.progress,
    certificateUrl: cleanOptionalString(input.certificateUrl),
    credentialUrl: cleanOptionalString(input.credentialUrl),
    startedAt:
      input.startedAt === undefined ? undefined : cleanOptionalDate(input.startedAt),
    completedAt:
      input.completedAt === undefined
        ? undefined
        : cleanOptionalDate(input.completedAt),
    featured: input.featured,
    displayOrder: input.displayOrder,
  };
}

export async function listCourses(options: CourseListOptions = {}) {
  const prisma = getPrisma();
  const courses = await prisma.course.findMany({
    where: {
      featured: options.featured,
      status: options.status,
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return courses.map(toCourse);
}

export async function getCourseById(id: string) {
  const prisma = getPrisma();
  const course = await prisma.course.findUnique({ where: { id } });
  return course ? toCourse(course) : null;
}

export async function getCourseBySlug(slug: string) {
  const prisma = getPrisma();
  const course = await prisma.course.findUnique({ where: { slug } });
  return course ? toCourse(course) : null;
}

export async function createCourse(input: CourseCreateInput) {
  const prisma = getPrisma();
  const data = courseCreateSchema.parse(input);
  const course = await prisma.course.create({
    data: toCourseCreateData(data),
  });

  return toCourse(course);
}

export async function updateCourse(id: string, input: CourseUpdateInput) {
  const prisma = getPrisma();
  const data = courseUpdateSchema.parse(input);
  const course = await prisma.course.update({
    where: { id },
    data: toCourseUpdateData(data),
  });

  return toCourse(course);
}

export async function deleteCourse(id: string) {
  const prisma = getPrisma();
  await prisma.course.delete({ where: { id } });
}

