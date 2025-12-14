import { z } from "zod";

export const ScheduleIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Mongo ID"),
});

export type ClassIdParams = z.infer<typeof ScheduleIdParamsSchema>;

export const UpdateScheduleSchema = z
  .object({
    day_of_week: z
      .enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ])
      .optional(),
    start_time: z.number().min(0).max(1439).optional(),
    end_time: z.number().min(1).max(1440).optional(),
    note: z.string().optional(),
  })
  .refine(
    (data) =>
      data.start_time === undefined ||
      data.end_time === undefined ||
      data.start_time < data.end_time,
    {
      message: "start_time must be less than end_time",
    }
  )
  .strict();

export type UpdateScheduleInput = z.infer<typeof UpdateScheduleSchema>;
