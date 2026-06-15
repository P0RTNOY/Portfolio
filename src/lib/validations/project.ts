import { z } from "zod";

export const projectStatusValues = [
  "planned",
  "in-progress",
  "completed",
  "archived",
] as const;

export const projectStatusSchema = z.enum(projectStatusValues);

const optionalUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid URL.")
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalTextSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal("").transform(() => undefined));

const stringListSchema = z
  .array(z.string().trim().min(1).max(80))
  .max(20)
  .default([]);

export const projectBaseSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug is required.")
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Use lowercase letters, numbers, and hyphens only.",
    }),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description is required.")
    .max(240),
  fullDescription: z.string().trim().max(5000).default(""),
  techStack: stringListSchema,
  githubUrl: optionalUrlSchema,
  liveUrl: optionalUrlSchema,
  imageUrl: optionalUrlSchema,
  status: projectStatusSchema.default("planned"),
  featured: z.boolean().default(false),
  role: optionalTextSchema,
  highlights: stringListSchema,
  problemSolved: optionalTextSchema,
  technicalChallenges: optionalTextSchema,
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export const projectCreateSchema = projectBaseSchema;

export const projectUpdateSchema = projectBaseSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one project field is required.",
  },
);

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
