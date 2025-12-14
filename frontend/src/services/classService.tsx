import type { Class, PaginatedResponse } from "@/interfaces/class";
import type { ApiResponse } from "@/interfaces/common";
import apiClient from "./apiClient";

const classApi = {
  getAllClasses: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortField?: string;
    sortOrder?: "asc" | "desc";
  }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Class>>>("class", { params }),

  getClassById: (id: string) =>
    apiClient.get<ApiResponse<Class>>(`class/${id}`),

  createClass: (payload: Partial<Class>) =>
    apiClient.post<ApiResponse<Class>>("class", payload),

  updateClass: (id: string, payload: Partial<Class>) =>
    apiClient.put<ApiResponse<Class>>(`class/${id}`, payload),

  deleteClass: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`class/${id}`),
};

export default classApi;
