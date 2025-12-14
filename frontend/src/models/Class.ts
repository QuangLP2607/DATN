import { Schema, model, Types, Document } from "mongoose";

export interface IClass extends Document {
  name: string;
  course_id: Types.ObjectId;
  teacher_ids: Types.ObjectId[];
  start_date: Date;
  end_date: Date;
  status: "upcoming" | "active" | "finished";
  room: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const classSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, trim: true },
    course_id: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    teacher_ids: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      validate: [
        (val: Types.ObjectId[]) => val.length > 0,
        "At least one teacher is required",
      ],
      required: true,
    },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["upcoming", "active", "finished"],
      default: "upcoming",
    },
    room: { type: String, required: true },
  },
  { timestamps: true }
);

// Pre-save hook: tự động cập nhật status
classSchema.pre("save", function (next) {
  const now = new Date();
  if (now < this.start_date) this.status = "upcoming";
  else if (now >= this.start_date && now <= this.end_date)
    this.status = "active";
  else this.status = "finished";
  next();
});

// Pre-update hook: cập nhật status khi update start_date hoặc end_date
classSchema.pre("findOneAndUpdate", async function (next) {
  const update: any = this.getUpdate();
  if (update.start_date || update.end_date) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    const start = update.start_date
      ? new Date(update.start_date)
      : docToUpdate.start_date;
    const end = update.end_date
      ? new Date(update.end_date)
      : docToUpdate.end_date;

    const now = new Date();
    if (now < start) update.status = "upcoming";
    else if (now >= start && now <= end) update.status = "active";
    else update.status = "finished";

    this.setUpdate(update);
  }
  next();
});

export const ClassModel = model<IClass>("Class", classSchema, "classes");
