import AppError from "@/core/AppError";
import { ClassModel } from "@/models/Class";
import { SearchClassesInput } from "./dto/searchClasses";
import { CreateClassInput } from "./dto/createClass";
import { ClassIdParams, UpdateClassInput } from "./dto/updateClass";

export default {
  // -------------------- search classes --------------------
  search: async (data: SearchClassesInput) => {
    const { page, limit, sortBy, order, search, from, to } = data;
    const mongoQuery: Record<string, any> = {};

    if (search?.trim()) {
      const keyword = search.trim();
      mongoQuery.$or = [{ name: { $regex: keyword, $options: "i" } }];
    }

    if (from || to) {
      mongoQuery.start_date = {};
      mongoQuery.end_date = {};
      if (from) {
        mongoQuery.start_date.$gte = new Date(from);
        mongoQuery.end_date.$gte = new Date(from);
      }
      if (to) {
        mongoQuery.start_date.$lte = new Date(to);
        mongoQuery.end_date.$lte = new Date(to);
      }
    }

    const skip = (page - 1) * limit;
    const [classes, total] = await Promise.all([
      ClassModel.find(mongoQuery)
        .select("-__v")
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ClassModel.countDocuments(mongoQuery),
    ]);

    return {
      classes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // -------------------- get my classes --------------------
  getMy: async (user: { id: string }) => {
    return ClassModel.find({
      teacher_ids: user.id,
    })
      .select("-__v")
      .lean();
  },

  // -------------------- create class --------------------
  create: async (data: CreateClassInput) => {
    const newClass = await ClassModel.create(data);
    return { id: newClass._id.toString() };
  },

  // -------------------- update class --------------------
  update: async ({ id }: ClassIdParams, data: UpdateClassInput) => {
    const c = await ClassModel.findById(id);
    if (!c) throw AppError.notFound("Class not found");

    Object.assign(c, data);
    await c.save();
  },
};
