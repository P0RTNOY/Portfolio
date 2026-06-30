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
  const normalizedCourse: Course = {
    ...course,
    skills: parseStringArray(course.skills),
    status: courseStatusSchema.catch("planned").parse(course.status),
  };

  if (
    course.slug === "example-certification-course" &&
    course.title === "Example Certification Course"
  ) {
    return {
      ...normalizedCourse,
      title: "Draft Certification Learning Record",
      provider: "Learning Platform",
      courseUrl: "https://github.com/P0RTNOY",
      shortDescription:
        "Demo learning record for testing the course layout and admin editing flow.",
      fullDescription:
        "This is demo course content. Replace it from the admin dashboard with a real course or certification when you are ready.",
      instructor: null,
      status: "planned",
      progress: 0,
      featured: false,
    };
  }

  if (
    course.slug === "example-in-progress-course" &&
    course.title === "Example In-Progress Course"
  ) {
    return {
      ...normalizedCourse,
      title: "Draft In-Progress Learning Record",
      courseUrl: "https://github.com/P0RTNOY",
      shortDescription:
        "Demo learning record for showing in-progress learning with a progress bar.",
    };
  }

  return normalizedCourse;
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
