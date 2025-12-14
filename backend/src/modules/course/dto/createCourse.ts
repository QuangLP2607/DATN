import { z } from "zod";

export const CreateCourseSchema = z
  .object({
    code: z.string().min(1, { message: "Code is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"]),
  })
  .strict();

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
