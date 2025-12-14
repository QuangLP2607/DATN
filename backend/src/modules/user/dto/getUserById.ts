import { z } from "zod";

export const GetUserByIdSchema = z
  .object({
    id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid user ID",
    }),
  })
  .strict();

export type GetUserByIdInput = z.infer<typeof GetUserByIdSchema>;
