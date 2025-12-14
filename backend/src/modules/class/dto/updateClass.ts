import { z } from "zod";

export const ClassIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Mongo ID"),
});

export type ClassIdParams = z.infer<typeof ClassIdParamsSchema>;

export const UpdateClassSchema = z
  .object({
    course_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid course ID" })
      .optional(),
    name: z.string().min(1, { message: "Name is required" }).optional(),
    description: z.string().optional(),
    start_date: z.string().datetime({ offset: true }).optional(),
    end_date: z.string().datetime({ offset: true }).optional(),
    teacher_ids: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  })
  .strict();

export type UpdateClassInput = z.infer<typeof UpdateClassSchema>;
