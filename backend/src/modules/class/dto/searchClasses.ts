import { z } from "zod";
import { paginationQuerySchema } from "@/utils/zod";

export const SearchClassesSchema = paginationQuerySchema.extend({
  from: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("Start date for filtering classes"),
  to: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("End date for filtering classes"),
});

// --- TypeScript type từ Zod ---
export type SearchClassesInput = z.infer<typeof SearchClassesSchema>;
