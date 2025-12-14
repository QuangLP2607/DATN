import { z } from "zod";

export const CreateClassSchema = z
  .object({
    course_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid course ID" }),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
  })
  .strict();

export type CreateClassInput = z.infer<typeof CreateClassSchema>;
