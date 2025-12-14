import { z } from "zod";

export const CreateRoomSchema = z.object({
  name: z.string().trim().min(3).max(100),
});

export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;

export const JoinRoomSchema = z.object({
  roomId: z.string().trim().min(3),
  name: z.string().trim().min(3).max(100),
});
export type JoinRoomInput = z.infer<typeof JoinRoomSchema>;
