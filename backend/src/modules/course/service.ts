import AppError from "@/core/AppError";
import { CourseModel } from "@/models/Course";
import { SearchCoursesInput } from "./dto/searchCourses";
import { CreateCourseInput } from "./dto/createCourse";
import { CourseIdParams, UpdateCourseInput } from "./dto/updateCourse";

export default {
  // -------------------- search courses --------------------
  searchCourses: async (data: SearchCoursesInput) => {
    const { page, limit, sortBy, order, search } = data;
    const mongoQuery: Record<string, any> = {};

    if (search?.trim()) {
      const keyword = search.trim();
      mongoQuery.$or = [
        { code: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      CourseModel.find(mongoQuery)
        .select("-__v")
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CourseModel.countDocuments(mongoQuery),
    ]);

    return {
      courses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // -------------------- create course --------------------
  createCourse: async (data: CreateCourseInput) => {
    const existing = await CourseModel.findOne({ code: data.code });
    if (existing) throw AppError.conflict("Course code already exists");
    await CourseModel.create(data);
  },

  // -------------------- update course --------------------
  updateCourse: async ({ id }: CourseIdParams, data: UpdateCourseInput) => {
    const course = await CourseModel.findById(id);
    if (!course) throw AppError.notFound("Course not found");
    Object.assign(course, data);
    await course.save();
  },
};
