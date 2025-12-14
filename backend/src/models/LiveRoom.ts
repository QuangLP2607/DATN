import { Schema, model } from "mongoose";
import { ILiveRoom } from "@/interfaces/liveRoom";

const LiveRoomSchema = new Schema<ILiveRoom>(
  {
    name: { type: String, required: true },
    classId: { type: String, required: true },
    createdBy: { type: String, required: true },
    status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

export default model<ILiveRoom>("LiveRoom", LiveRoomSchema);
