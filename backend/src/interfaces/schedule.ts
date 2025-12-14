import { Types } from "mongoose";

export interface ISchedule {
  class_id: Types.ObjectId;
  day_of_week:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  start_time: number;
  end_time: number;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
