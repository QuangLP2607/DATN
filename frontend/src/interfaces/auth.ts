import type { Role } from "@/models/User";

// login
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: Role;
}

export interface ValidationError {
  field: string;
  message: string;
}

// sign up
export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  role: Role;
}

// Response payloads

export interface SignupResponse {
  id: string;
}
