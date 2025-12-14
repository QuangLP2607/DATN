import { Types } from "mongoose";

export interface IMediaFile {
  class_id: Types.ObjectId | string;
  file_key: string;
  file_url?: string;
  file_type: string;
  media_type: "image" | "video";
  file_size?: number;
  uploaded_by?: Types.ObjectId | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
