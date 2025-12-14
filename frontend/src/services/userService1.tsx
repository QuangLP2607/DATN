import apiClient from "./apiClient";

import type { ApiResponse } from "@interfaces/common";
import type { StudentCourseResponse } from "@interfaces/student";

// ====== USER TYPES ======
export interface UserProfile {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  status: string;
  created_at?: string;
}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface UserListItem {
  _id: string;
  username: string;
  email: string;
  dob?: string;
  phone?: string;
  status: string;
  note?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ====== USER API ======
const userApi = {
  // PROFILE
  getProfile: () => apiClient.get<ApiResponse<UserProfile>>("user/me"),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.put<ApiResponse<UserProfile>>("user/me", payload),
  updatePassword: (payload: UpdatePasswordPayload) =>
    apiClient.put<ApiResponse<{ message: string }>>("user/password", payload),

  // USERS LIST
  getUsersByRole: (params: {
    role: "student" | "teacher";
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    search?: string;
  }) =>
    apiClient.get<ApiResponse<PaginatedResponse<UserListItem>>>("user", {
      params,
    }),

  // GET USER DETAIL BY ID (ADMIN USE)
  getUserById: (id: string, role: "student" | "teacher" | "admin") =>
    apiClient.get<ApiResponse<UserProfile>>(`user/${id}`, {
      params: { role },
    }),

  // GET COURSES OF A STUDENT
  getStudentCourses: (studentId: string) =>
    apiClient.get<ApiResponse<StudentCourseResponse>>(
      `user/${studentId}/courses`
    ),
};

export default userApi;
