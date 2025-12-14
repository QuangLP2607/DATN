import { Schema, model, Types } from "mongoose";

const enrollmentSchema = new Schema(
  {
    class_id: { type: Types.ObjectId, ref: "Class", required: true },
    student_id: { type: Types.ObjectId, ref: "User", required: true },
    enrolled_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

enrollmentSchema.index({ class_id: 1, student_id: 1 }, { unique: true });

export const EnrollmentModel = model(
  "Enrollment",
  enrollmentSchema,
  "enrollments"
);
