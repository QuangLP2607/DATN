import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const CreateScheduleSchema = z
  .object({
    class_id: objectId,
    day_of_week: z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]),
    start_time: z.number().min(0).max(1439),
    end_time: z.number().min(1).max(1440),
    note: z.string().optional(),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "start_time must be less than end_time",
    path: ["start_time"],
  })
  .strict();

export type CreateScheduleInput = z.infer<typeof CreateScheduleSchema>;
