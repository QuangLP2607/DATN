import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, { message: "Old password too short" }),
    newPassword: z.string().min(6, { message: "New password too short" }),
  })
  .strict();

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
