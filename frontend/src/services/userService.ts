import type {
  getProfileResponse,
  UpdateProfilePayload,
} from "@/interfaces/user";
import type { ApiResponse } from "@/interfaces/common";
import apiClient from "./apiClient";

const authApi = {
  async getProfile(): Promise<getProfileResponse> {
    const res = await apiClient.get<ApiResponse<getProfileResponse>>("user/me");
    return res.data.data!;
  },

  updateProfile(payload: UpdateProfilePayload) {
    return apiClient.post<ApiResponse<null>>("user/me", payload);
  },
};

export default authApi;
