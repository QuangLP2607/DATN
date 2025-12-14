import type {
  LoginPayload,
  LoginResponse,
  SignupPayload,
  SignupResponse,
} from "@/interfaces/auth";
import type { ApiResponse } from "@/interfaces/common";
import apiClient from "./apiClient";

const authApi = {
  // ================= LOGIN =================
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload
    );

    return res.data.data!;
  },

  // ================= SIGNUP =================
  async signup(payload: SignupPayload): Promise<SignupResponse> {
    const res = await apiClient.post<ApiResponse<SignupResponse>>(
      "/auth/signup",
      payload
    );

    return res.data.data!;
  },

  // ================= LOGOUT =================
  async logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    await apiClient.post("/auth/logout");
  },
};

export default authApi;
