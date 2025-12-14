import { z } from "zod";
import { Roles, Role } from "@/interfaces/user";
import { paginationQuerySchema } from "@/utils/zod";

const roleEnum = z.enum(Object.keys(Roles) as [Role, ...Role[]]);

export const SearchUsersSchema = paginationQuerySchema
  .extend({
    sortBy: z
      .enum(["username", "email", "createdAt", "updatedAt"])
      .default("createdAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
    role: roleEnum.optional(),
  })
  .strict();

export type SearchUsersInput = z.infer<typeof SearchUsersSchema>;
