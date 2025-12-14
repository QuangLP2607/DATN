import { z } from "zod";

export const SearchSessionSchema = z.object({
  class_id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
  status: z.enum(["upcoming", "active", "finished", "cancelled"]).optional(),
  week_number: z.coerce.number().int().min(1).optional(),
});

export type SearchSessionInput = z.infer<typeof SearchSessionSchema>;
