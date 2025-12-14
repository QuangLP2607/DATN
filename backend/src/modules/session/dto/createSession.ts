import { z } from "zod";

export const CreateSessionSchema = z.object({
  schedule_id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  week_number: z.number().int().min(1),
  date: z.string().datetime({ offset: true }),
  start_time: z.number().int().min(0).max(1440),
  end_time: z.number().int().min(1).max(1440),
  note: z.string().optional(),
});

export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;
