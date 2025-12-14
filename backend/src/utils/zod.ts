import { z, ZodRawShape, ZodObject } from "zod";

// --------------------- ObjectId ---------------------
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

// --------------------- Time string HH:mm ---------------------
export const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format");

// --------------------- ISO Date ---------------------
export const isoDateSchema = z.preprocess(
  (arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  },
  z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date format",
  })
);

// Optional ISO Date
export const optionalIsoDateSchema = isoDateSchema.optional();

// --------------------- Optional string with min/max ---------------------
export const optionalStringSchema = (min = 1, max = 255) =>
  z
    .string()
    .trim()
    .min(min, { message: `Must be at least ${min} characters` })
    .max(max, { message: `Must be at most ${max} characters` })
    .optional();

// --------------------- Pagination query ---------------------
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().trim().min(1).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().trim().optional(),
});

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;

// --------------------- Non-empty object ---------------------
export const nonEmptyObject = <T extends ZodRawShape>(schema: ZodObject<T>) =>
  schema.refine(
    (data) =>
      Object.keys(data).some(
        (key) => data[key as keyof typeof data] !== undefined
      ),
    { message: "At least one field must be provided" }
  );
