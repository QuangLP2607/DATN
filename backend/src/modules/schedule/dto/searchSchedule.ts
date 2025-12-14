import { z } from "zod";

export const SearchScheduleSchema = z.object({
  class_id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  teacher_id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
});

export type SearchScheduleInput = z.infer<typeof SearchScheduleSchema>;
