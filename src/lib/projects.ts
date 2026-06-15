import type { Prisma, Project as PrismaProject } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  projectCreateSchema,
  projectStatusSchema,
  projectUpdateSchema,
  type ProjectCreateInput,
  type ProjectStatus,
  type ProjectUpdateInput,
} from "@/lib/validations/project";

export type Project = Omit<
  PrismaProject,
  "highlights" | "status" | "techStack"
> & {
  highlights: string[];
  status: ProjectStatus;
  techStack: string[];
};

type ProjectListOptions = {
  featured?: boolean;
  status?: ProjectStatus;
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

function toProject(project: PrismaProject): Project {
  return {
    ...project,
    highlights: parseStringArray(project.highlights),
    status: projectStatusSchema.catch("planned").parse(project.status),
    techStack: parseStringArray(project.techStack),
  };
}

function toProjectCreateData(input: ProjectCreateInput): Prisma.ProjectCreateInput {
  return {
    title: input.title,
    slug: input.slug,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription ?? "",
    githubUrl: cleanOptionalString(input.githubUrl),
    highlights: serializeStringArray(input.highlights) ?? "[]",
    imageUrl: cleanOptionalString(input.imageUrl),
    liveUrl: cleanOptionalString(input.liveUrl),
    problemSolved: cleanOptionalString(input.problemSolved),
    role: cleanOptionalString(input.role),
    status: input.status ?? "planned",
    featured: input.featured ?? false,
    techStack: serializeStringArray(input.techStack) ?? "[]",
    technicalChallenges: cleanOptionalString(input.technicalChallenges),
    displayOrder: input.displayOrder ?? 0,
  };
}

function toProjectUpdateData(input: ProjectUpdateInput): Prisma.ProjectUpdateInput {
  return {
    title: input.title,
    slug: input.slug,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    githubUrl: cleanOptionalString(input.githubUrl),
    highlights: serializeStringArray(input.highlights),
    imageUrl: cleanOptionalString(input.imageUrl),
    liveUrl: cleanOptionalString(input.liveUrl),
    problemSolved: cleanOptionalString(input.problemSolved),
    role: cleanOptionalString(input.role),
    status: input.status,
    featured: input.featured,
    techStack: serializeStringArray(input.techStack),
    technicalChallenges: cleanOptionalString(input.technicalChallenges),
    displayOrder: input.displayOrder,
  };
}

export async function listProjects(options: ProjectListOptions = {}) {
  const projects = await prisma.project.findMany({
    where: {
      featured: options.featured,
      status: options.status,
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return projects.map(toProject);
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  return project ? toProject(project) : null;
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findUnique({ where: { slug } });
  return project ? toProject(project) : null;
}

export async function createProject(input: ProjectCreateInput) {
  const data = projectCreateSchema.parse(input);
  const project = await prisma.project.create({
    data: toProjectCreateData(data),
  });

  return toProject(project);
}

export async function updateProject(id: string, input: ProjectUpdateInput) {
  const data = projectUpdateSchema.parse(input);
  const project = await prisma.project.update({
    where: { id },
    data: toProjectUpdateData(data),
  });

  return toProject(project);
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
}
