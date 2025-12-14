import { z } from "zod";

export const CourseIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Mongo ID"),
});

export type CourseIdParams = z.infer<typeof CourseIdParamsSchema>;

export const UpdateCourseSchema = z
  .object({
    code: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional(),
  })
  .strict();

export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
