import { Request, Response, NextFunction } from "express";
import Service from "./service";
import { Res } from "@/core/response";

export default {
  // -------------------- get my enrollments --------------------
  getMyEnrollments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const result = await Service.getByStudentId(user.id);
      return Res.success(res, "Get my enrollments successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- get enrollment by student id --------------------
  getByStudentId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.validated.params;
      const result = await Service.getByStudentId(id);
      return Res.success(
        res,
        "Get enrollments by student id successfully",
        result
      );
    } catch (error) {
      next(error);
    }
  },

  // -------------------- enroll --------------------
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.create(req.validated.body);
      return Res.created(res, "Enrolled successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- unenroll (rare case) --------------------
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.remove(req.validated.params);
      return Res.success(res, "Unenrolled successfully");
    } catch (error) {
      next(error);
    }
  },
};
