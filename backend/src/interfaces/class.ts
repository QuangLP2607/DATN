import { Types } from "mongoose";

export interface IClass {
  name: string;
  course_id: Types.ObjectId;
  teacher_ids?: Types.ObjectId[];
  start_date?: Date;
  end_date?: Date;
  status?: "upcoming" | "active" | "finished";
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
