import { z } from "zod";

export const LoginSchema = z
  .object({
    email: z.email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password too short" }),
  })
  .strict();

export type LoginInput = z.infer<typeof LoginSchema>;
