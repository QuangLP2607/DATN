import { Schema, model, Types } from "mongoose";
import { ILectureVideo } from "@/interfaces/lectureVideo";

const lectureVideoSchema = new Schema<ILectureVideo>(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    video_id: { type: Schema.Types.ObjectId, ref: "Media", required: true },
    thumbnail_id: { type: Schema.Types.ObjectId, ref: "Media" },
  },
  { timestamps: true }
);

export const LectureVideoModel = model<ILectureVideo>(
  "LectureVideo",
  lectureVideoSchema
);
