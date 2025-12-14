import type { ApiResponse } from "@/interfaces/common";
import type { MediaItem } from "@/interfaces/media";
import apiClient from "./apiClient";

const mediaApi = {
  // Signed URL để upload
  async getUploadUrl(payload: {
    class_id: string;
    file_name: string;
    file_type: string;
    uploaded_by?: string;
  }) {
    const res = await apiClient.post<
      ApiResponse<{ uploadUrl: string; fileKey: string }>
    >("media/upload-url", payload);

    return res.data.data!;
  },

  // Lưu metadata
  async saveMedia(payload: {
    class_id: string;
    file_key: string;
    file_type: string;
    size?: number;
    uploaded_by?: string;
  }) {
    const res = await apiClient.post<ApiResponse<MediaItem>>(
      "media/save",
      payload
    );
    return res.data.data!;
  },

  // Danh sách media theo class
  async getMediaByClass(classId: string) {
    const res = await apiClient.get<ApiResponse<MediaItem[]>>(
      `media/class/${classId}`
    );
    return res.data.data!;
  },

  // Lấy URL xem video
  async getViewUrl(fileKey: string): Promise<string> {
    const encoded = encodeURIComponent(fileKey);
    const res = await apiClient.get<ApiResponse<{ url: string }>>(
      `media/view-url?fileKey=${encoded}`
    );
    return res.data.data!.url;
  },

  // Xóa media
  async delete(mediaId: string) {
    return apiClient.delete(`media/${mediaId}`);
  },
};

export default mediaApi;
