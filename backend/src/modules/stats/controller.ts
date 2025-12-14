import { Request, Response, NextFunction } from "express";
import { success } from "@/core/response";
import {
  getStudentsByMonthService,
  getStudentsPerCourseService,
} from "./service";

// GET /stats/students/monthly
export const getStudentsByMonth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getStudentsByMonthService();
    success(res, "Lấy thống kê học viên theo tháng thành công", stats);
  } catch (error) {
    next(error);
  }
};

// GET /stats/courses/students
export const getStudentsPerCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getStudentsPerCourseService();
    success(res, "Lấy số học viên theo khóa học thành công", stats);
  } catch (error) {
    next(error);
  }
};
