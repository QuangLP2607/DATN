import apiClient from "./apiClient";

import type { ApiResponse } from "@interfaces/common";
import type { CourseStudents, StudentsByMonth } from "@interfaces/stats";

const statsApi = {
  // GET /stats/students/monthly
  getStudentsByMonth: () =>
    apiClient.get<ApiResponse<StudentsByMonth[]>>("stats/students/monthly"),

  getStudentsPerCourse: () =>
    apiClient.get<ApiResponse<CourseStudents[]>>("stats/courses/students"),
};

export default statsApi;
