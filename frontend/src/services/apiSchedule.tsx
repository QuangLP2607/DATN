import type { ApiResponse } from "@/interfaces/common";
import apiClient from "./apiClient";

export interface ApiSchedule {
  class_id: string;
  class_name: string;
  course: { name: string };
  start_date: string;
  end_date: string;
  schedule: {
    day_of_week: string;
    start_time: string;
    end_time: string;
    location?: string;
  }[];
  status: string;
  mode: string;
  room?: string;
}

const scheduleApi = {
  getAllSchedules: () =>
    apiClient.get<ApiResponse<ApiSchedule[]>>("course/schedule/all"),
};

export default scheduleApi;
