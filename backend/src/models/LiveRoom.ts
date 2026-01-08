import { Schema, model, Types } from "mongoose";
import { ILiveRoom } from "@/interfaces/liveRoom";

const LiveRoomSchema = new Schema<ILiveRoom>(
  {
    name: { type: String, required: true },
    classId: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    teacherOnline: { type: Boolean, default: false },
    lastSeenTeacher: { type: Date },
  },
  { timestamps: true }
);

export default model<ILiveRoom>("LiveRoom", LiveRoomSchema);
