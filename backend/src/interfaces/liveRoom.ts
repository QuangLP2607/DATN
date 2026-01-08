import { Types } from "mongoose";

export interface ILiveRoom {
  id?: string;
  name: string;
  classId: string;
  createdBy: Types.ObjectId;
  status: "OPEN" | "CLOSED";
  startedAt: Date;
  endedAt?: Date;
  participants: Types.ObjectId[];
  teacherOnline?: boolean;
  lastSeenTeacher?: Date;
}
