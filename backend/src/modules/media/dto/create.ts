import { z } from "zod";
import {
  stringSchema,
  mimeTypeSchema,
  fileSizeSchema,
} from "../../../utils/zod";

export const CreateMediaSchema = z
  .object({
    file_key: stringSchema("File key"),
    file_name: stringSchema("File name"),
    file_type: mimeTypeSchema,
    file_size: fileSizeSchema().optional(),
  })
  .strict();

export type CreateMediaInput = z.infer<typeof CreateMediaSchema>;
