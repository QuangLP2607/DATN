import type { JitsiRoomResponse } from "@/interfaces/jitsi";
import type { ApiResponse } from "@/interfaces/common";
import type { CreateRoomInput, JoinRoomInput } from "@/interfaces/jitsi";
import apiClient from "./apiClient";

const jitsiApi = {
  async createRoom(payload: CreateRoomInput): Promise<JitsiRoomResponse> {
    const res = await apiClient.post<ApiResponse<JitsiRoomResponse>>(
      "/live-room/create",
      payload
    );
    return res.data.data!;
  },

  async joinRoom(payload: JoinRoomInput): Promise<JitsiRoomResponse> {
    const res = await apiClient.post<ApiResponse<JitsiRoomResponse>>(
      "/live-room/join",
      payload
    );
    return res.data.data!;
  },
};

export default jitsiApi;
