import { z } from "zod";

// ================= CREATE ROOM =================
export const CreateLiveRoomSchema = z.object({
  name: z.string().min(1, { message: "Room name required" }),
});

export type CreateLiveRoomInput = z.infer<typeof CreateLiveRoomSchema>;

// ================= JOIN ROOM =================
export const JoinLiveRoomSchema = z.object({
  roomId: z.string().min(1, { message: "Room ID required" }),
});

export type JoinLiveRoomInput = z.infer<typeof JoinLiveRoomSchema>;

// ================= RESPONSE =================
export interface LiveRoomResponse {
  roomId: string; // MongoDB _id
  token: string; // Jitsi JWT
}
