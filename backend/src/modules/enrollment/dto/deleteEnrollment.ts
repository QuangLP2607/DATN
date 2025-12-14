import { z } from "zod";

export const EnrollmentIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export type EnrollmentIdParams = z.infer<typeof EnrollmentIdParamsSchema>;
