export interface UploadUrlPayload {
  class_id: string;
  file_name: string;
  file_type: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
}

export interface SaveMediaPayload {
  class_id: string;
  file_key: string;
  file_url: string;
  file_type: string;
  size: number;
  uploaded_by?: string;
}

export interface MediaItem {
  _id: string;
  class_id: string;
  file_key: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by?: string;
  createdAt: string;
  updatedAt: string;
}
