import { z } from "zod";

export const SessionIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const UpdateSessionSchema = z
  .object({
    date: z.string().datetime({ offset: true }).optional(),
    start_time: z.number().int().min(0).max(1440).optional(),
    end_time: z.number().int().min(1).max(1440).optional(),
    status: z.enum(["upcoming", "active", "finished", "cancelled"]).optional(),
    note: z.string().optional(),
  })
  .strict();

export type UpdateSessionInput = z.infer<typeof UpdateSessionSchema>;
