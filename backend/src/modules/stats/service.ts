import Student from "@/models/Student";
import Class from "@/models/Class";
import Enrollment from "@/models/Enrollment";

// Học viên theo tháng
export const getStudentsByMonthService = async () => {
  const stats = await Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$enrolled_at" },
          month: { $month: "$enrolled_at" },
        },
        total: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        year: "$_id.year",
        month: "$_id.month",
        total: 1,
        _id: 0,
      },
    },
  ]);

  return stats;
};

// Số học viên theo khóa học
export const getStudentsPerCourseService = async () => {
  // Lấy tất cả khóa học và đếm học viên trong từng lớp
  const stats = await Class.aggregate([
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "class_id",
        as: "enrollments",
      },
    },
    {
      $group: {
        _id: "$course_id",
        total_students: { $sum: { $size: "$enrollments" } },
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    { $unwind: "$course" },
    {
      $project: {
        course_id: "$course._id",
        course_name: "$course.name",
        total_students: 1,
        _id: 0,
      },
    },
    { $sort: { total_students: -1 } },
  ]);

  return stats;
};
