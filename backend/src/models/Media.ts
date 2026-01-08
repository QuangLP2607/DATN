import { Schema, model, Types } from "mongoose";
import { IMedia } from "@/interfaces/media";

const mediaSchema = new Schema<IMedia>(
  {
    file_name: { type: String, required: true, trim: true },
    file_key: { type: String, required: true, index: true },
    file_type: { type: String, required: true },
    file_size: { type: Number, default: 0 },
    uploaded_by: { type: Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

mediaSchema.index({ file_type: 1 });

export const MediaModel = model<IMedia>("Media", mediaSchema);
