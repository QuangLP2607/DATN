import { Schema, model, Types } from "mongoose";
import { ISession } from "@/interfaces/session";

const sessionSchema = new Schema<ISession>(
  {
    class_id: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    schedule_id: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    week_number: { type: Number, required: true },
    date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    status: {
      type: String,
      enum: ["upcoming", "active", "finished", "cancelled"],
      default: "upcoming",
    },
    note: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook: tự động tính status theo date
sessionSchema.pre("save", function (next) {
  const now = new Date();
  const today = new Date(now.toDateString());
  const sessionDate = new Date(this.date.toDateString());

  if (today < sessionDate) this.status = "upcoming";
  else if (today.getTime() === sessionDate.getTime()) this.status = "active";
  else this.status = "finished";
  next();
});

// Index cho query theo class + date
sessionSchema.index({ class_id: 1, date: 1 });

export const SessionModel = model<ISession>(
  "Session",
  sessionSchema,
  "sessions"
);
