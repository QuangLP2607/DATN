import { z } from "zod";

export const CreateEnrollmentSchema = z.object({
  class_id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  student_id: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export type CreateEnrollmentInput = z.infer<typeof CreateEnrollmentSchema>;
