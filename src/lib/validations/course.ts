import { z } from "zod";

export const courseStatusValues = [
  "planned",
  "in-progress",
  "completed",
  "archived",
] as const;

export const courseStatusSchema = z.enum(courseStatusValues);

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

const skillsSchema = z.array(z.string().trim().min(1).max(80)).max(24);

const optionalDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format.")
  .optional()
  .or(z.literal("").transform(() => undefined));

const courseFields = {
  title: z.string().trim().min(2, "Title is required.").max(180),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug is required.")
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Use lowercase letters, numbers, and hyphens only.",
    }),
  provider: z.string().trim().min(2, "Provider is required.").max(80),
  courseUrl: z.string().trim().url("Enter a valid course URL."),
  imageUrl: optionalUrlSchema,
  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description is required.")
    .max(280),
  fullDescription: z.string().trim().max(5000),
  skills: skillsSchema,
  instructor: optionalTextSchema,
  status: courseStatusSchema,
  progress: z.coerce.number().int().min(0).max(100),
  certificateUrl: optionalUrlSchema,
  credentialUrl: optionalUrlSchema,
  startedAt: optionalDateSchema,
  completedAt: optionalDateSchema,
  featured: z.boolean(),
  displayOrder: z.coerce.number().int().min(0).max(9999),
};

export const courseBaseSchema = z.object(courseFields);

export const courseCreateSchema = z.object({
  ...courseFields,
  provider: courseFields.provider.default("Udemy"),
  fullDescription: courseFields.fullDescription.default(""),
  skills: courseFields.skills.default([]),
  status: courseFields.status.default("planned"),
  progress: courseFields.progress.default(0),
  featured: courseFields.featured.default(false),
  displayOrder: courseFields.displayOrder.default(0),
});

export const courseUpdateSchema = z.object(courseFields).partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one course field is required.",
  },
);

export type CourseStatus = z.infer<typeof courseStatusSchema>;
export type CourseCreateInput = z.infer<typeof courseCreateSchema>;
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;

