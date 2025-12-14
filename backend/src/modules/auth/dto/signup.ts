import { z } from "zod";
import { Roles, Role } from "@/interfaces/user";

const roleEnum = z.enum(Object.values(Roles) as [Role, ...Role[]]);

export const SignupSchema = z
  .object({
    role: roleEnum,
    username: z.string().min(3, "Username too short"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password too short"),
  })
  .strict();

export type SignupInput = z.infer<typeof SignupSchema>;
