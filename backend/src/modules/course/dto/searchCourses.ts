import { z } from "zod";
import { paginationQuerySchema } from "@/utils/zod";

export const SearchCoursesSchema = paginationQuerySchema.extend({
  sortBy: z.enum(["name", "code", "createdAt"]).default("name"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

// --- TypeScript type từ Zod ---
export type SearchCoursesInput = z.infer<typeof SearchCoursesSchema>;
