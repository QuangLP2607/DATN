import { z } from "zod";
import { optionalIsoDateSchema } from "@/utils/zod";
import { Role, IAdmin, IStudent, ITeacher } from "@/interfaces/user";

export const UpdateProfileSchema = z
  .object({
    username: z.string().trim().min(3).max(50).optional(),
    full_name: z.string().trim().min(3).max(120).optional(),
    avatar_url: z.string().optional(),
    phone: z.string().trim().max(20).optional(),
    address: z.string().trim().max(255).optional(),
    japaneseLevel: z.enum(["Không", "N5", "N4", "N3", "N2", "N1"]).optional(),
    note: z.string().trim().max(255).optional(),
    dob: optionalIsoDateSchema,
  })
  .strict();

export type UpdateProfileInputMap = {
  ADMIN: Partial<IAdmin>;
  STUDENT: Partial<IStudent>;
  TEACHER: Partial<ITeacher>;
};

export type UpdateProfileInput<R extends Role> = UpdateProfileInputMap[R];
