import { Request, Response, NextFunction } from "express";
import Service from "./service";

import { Res } from "@/core/response";

export default {
  // -------------------- search courses --------------------
  searchCourses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.searchCourses(req.validated.query);
      return Res.success(res, "Courses fetched successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- create course --------------------
  createCourse: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.createCourse(req.validated.body);
      return Res.success(res, "Course created successfully");
    } catch (error) {
      next(error);
    }
  },

  // -------------------- update course --------------------
  updateCourse: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.updateCourse(req.validated.params, req.validated.body);
      return Res.success(res, "Course updated successfully");
    } catch (error) {
      next(error);
    }
  },
};
