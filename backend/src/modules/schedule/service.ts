import AppError from "@/core/AppError";
import { ScheduleModel } from "@/models/Schedule";
import { ClassModel } from "@/models/Class";
import { SearchScheduleInput } from "./dto/searchSchedule";
import { CreateScheduleInput } from "./dto/createSchedule";
import { UpdateScheduleInput } from "./dto/updateSchedule";
import { Types } from "mongoose";

export default {
  // -------------------- search schedules --------------------
  search: async (query: SearchScheduleInput) => {
    const { class_id, from, to } = query;

    const mongoQuery: Record<string, any> = {};

    if (class_id) {
      mongoQuery.class_id = new Types.ObjectId(class_id);
    }

    if (from || to) {
      mongoQuery.date = {};
      if (from) mongoQuery.date.$gte = new Date(from);
      if (to) mongoQuery.date.$lte = new Date(to);
    }

    const schedules = await ScheduleModel.find(mongoQuery)
      .populate("class_id", "name")
      .sort({ date: 1, start_time: 1 })
      .lean();

    return schedules;
  },

  // -------------------- create schedule --------------------
  create: async (data: CreateScheduleInput) => {
    const { class_id, day_of_week, start_time, end_time } = data;

    if (end_time <= start_time) {
      throw AppError.badRequest("end_time must be after start_time");
    }

    const classExists = await ClassModel.exists({ _id: class_id });
    if (!classExists) {
      throw AppError.notFound("Class not found");
    }

    const overlap = await ScheduleModel.exists({
      class_id,
      day_of_week,
      start_time: { $lt: end_time },
      end_time: { $gt: start_time },
    });

    if (overlap) {
      throw AppError.conflict("Schedule time overlaps with existing schedule");
    }

    const schedule = await ScheduleModel.create(data);

    return { id: schedule._id };
  },

  // -------------------- update schedule --------------------
  update: async (id: string, data: UpdateScheduleInput) => {
    if (
      data.start_time !== undefined &&
      data.end_time !== undefined &&
      data.end_time <= data.start_time
    ) {
      throw AppError.badRequest("end_time must be after start_time");
    }

    const schedule = await ScheduleModel.findById(id);
    if (!schedule) throw AppError.notFound("Schedule not found");

    Object.assign(schedule, data);
    await schedule.save();
  },

  // -------------------- delete schedule --------------------
  remove: async (id: string) => {
    const schedule = await ScheduleModel.findById(id);
    if (!schedule) throw AppError.notFound("Schedule not found");

    await schedule.deleteOne();
  },
};
