import { z } from "zod";
import { stringSchema } from "../../../utils/zod";

export const JoinLiveRoomSchema = z
  .object({
    room_name: stringSchema("roomName", 3, 50),
  })
  .strict();

export type JoinLiveRoomInput = z.infer<typeof JoinLiveRoomSchema>;

export interface LiveRoomResponse {
  roomId: string;
  token: string;
}
