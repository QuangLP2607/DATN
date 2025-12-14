import type { Role } from "@/models/User";

export interface getProfileResponse {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  role: Role;
}

export interface UpdateProfilePayload {
  username?: string;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
