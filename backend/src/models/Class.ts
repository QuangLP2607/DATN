import { Schema, model, Types } from "mongoose";
import { IClass } from "@/interfaces/class";
import cron from "node-cron";

const classSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, trim: true },
    course_id: { type: Schema.Types.ObjectId, ref: "Course" },
    teacher_ids: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    start_date: { type: Date },
    end_date: { type: Date },
    description: { type: String, trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: ["upcoming", "active", "finished"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

/**
 * Tính trạng thái dựa trên start_date / end_date
 */
function computeStatus(
  start?: Date,
  end?: Date
): "upcoming" | "active" | "finished" {
  const now = new Date();
  if (!start || !end) return "upcoming";
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "active";
  return "finished";
}

// Pre-save hook: tự động cập nhật status khi save document
classSchema.pre("save", function (next) {
  if (this.isModified("start_date") || this.isModified("end_date")) {
    this.status = computeStatus(this.start_date, this.end_date);
  }
  next();
});

// Pre-update hook: tự động cập nhật status khi update start_date hoặc end_date
classSchema.pre("findOneAndUpdate", async function (next) {
  const update: any = this.getUpdate();
  const updateSet = update.$set || update;

  if (updateSet.start_date || updateSet.end_date) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    const start = updateSet.start_date
      ? new Date(updateSet.start_date)
      : docToUpdate?.start_date;
    const end = updateSet.end_date
      ? new Date(updateSet.end_date)
      : docToUpdate?.end_date;

    const newStatus = computeStatus(start, end);

    update.$set = { ...updateSet, status: newStatus };
    this.setUpdate(update);
  }

  next();
});

export const ClassModel = model<IClass>("Class", classSchema, "classes");

/**
 * Optional: Cron job để cập nhật status tất cả class hằng ngày lúc 00:00
 * Nếu bạn muốn luôn chính xác cho các class đang active/upcoming/finished
 */
cron.schedule("0 0 * * *", async () => {
  const classes = await ClassModel.find({
    start_date: { $exists: true },
    end_date: { $exists: true },
  });

  for (const cls of classes) {
    const newStatus = computeStatus(cls.start_date, cls.end_date);
    if (cls.status !== newStatus) {
      cls.status = newStatus;
      await cls.save();
    }
  }

  console.log(`[${new Date().toISOString()}] Class statuses updated`);
});
