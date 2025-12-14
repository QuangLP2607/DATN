import apiClient from "./apiClient";

import type { ApiResponse } from "@interfaces/common";
import type {
  Course,
  CreateCoursePayload,
  PaginatedResponse,
  UpdateCoursePayload,
} from "@interfaces/course";

// ====== COURSE API ======
const courseApi = {
  // CREATE
  createCourse: (payload: CreateCoursePayload) =>
    apiClient.post<ApiResponse<Course>>("course", payload),

  // GET ALL (with pagination, search, sort) - đồng bộ với userApi
  getAllCourses: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
  }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Course>>>("course", {
      params,
    }),

  // GET BY ID
  getCourseById: (id: string) =>
    apiClient.get<ApiResponse<Course>>(`course/${id}`),

  // UPDATE
  updateCourse: (id: string, payload: UpdateCoursePayload) =>
    apiClient.put<ApiResponse<Course>>(`course/${id}`, payload),

  // DELETE
  deleteCourse: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`course/${id}`),
};

export default courseApi;
