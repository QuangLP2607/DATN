import type { ApiResponse } from "@/interfaces/common";
import apiClient from "./apiClient";

// ===== Types ================================================================
export interface CreateRoomInput {
  room_name: string;
  class_id: string;
}

export interface JoinRoomInput {
  room_name: string;
}

export interface LeaveRoomInput {
  roomId: string;
}

export interface PingRoomInput {
  roomId: string;
}

export interface JitsiRoomResponse {
  roomId: string;
  token: string;
}

// ===== API ================================================================
const jitsiApi = {
  async createRoom(payload: CreateRoomInput): Promise<JitsiRoomResponse> {
    const res = await apiClient.post<ApiResponse<JitsiRoomResponse>>(
      "/live-room/create",
      payload
    );
    if (!res.data.data) throw new Error("No data returned");
    return res.data.data;
  },

  async joinRoom(payload: JoinRoomInput): Promise<JitsiRoomResponse> {
    const res = await apiClient.post<ApiResponse<JitsiRoomResponse>>(
      "/live-room/join",
      payload
    );
    if (!res.data.data) throw new Error("No data returned");
    return res.data.data;
  },

  async leaveRoom(payload: LeaveRoomInput) {
    await apiClient.post("/live-room/leave", payload);
  },

  async pingRoom(payload: PingRoomInput) {
    await apiClient.post("/live-room/ping", payload);
  },
};

export default jitsiApi;
