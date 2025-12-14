import { Schema, model, Types, Document } from "mongoose";

export interface ISchedule extends Document {
  class_id: Types.ObjectId;
  day_of_week:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  start_time: string;
  end_time: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    class_id: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    day_of_week: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
    },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

export const ScheduleModel = model<ISchedule>(
  "Schedule",
  scheduleSchema,
  "schedules"
);
