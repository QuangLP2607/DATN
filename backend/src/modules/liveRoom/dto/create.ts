import { z } from "zod";
import { objectIdSchema, stringSchema } from "@/utils/zod";

export const CreateLiveRoomSchema = z
  .object({
    roomName: stringSchema("roomName", 3, 50),
    classId: objectIdSchema,
  })
  .strict();

export type CreateLiveRoomInput = z.infer<typeof CreateLiveRoomSchema>;
