import { Schema, model } from "mongoose";
import { IMediaFile } from "@/interfaces/mediaFile";

const mediaSchema = new Schema<IMediaFile>(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    file_key: { type: String, required: true, index: true },
    file_url: { type: String },
    file_type: { type: String, required: true },
    media_type: { type: String, enum: ["image", "video"], required: true },
    file_size: { type: Number },
    uploaded_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const MediaModel = model<IMediaFile>("MediaFile", mediaSchema);
