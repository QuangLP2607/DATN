import { Request, Response, NextFunction } from "express";
import Service from "./service";
import { Res } from "@/core/response";

export default {
  // -------------------- search classes --------------------
  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Service.search(req.validated.query);
      return Res.success(res, "Classes fetched successfully", result);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- get my classes --------------------
  getMy: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const classes = await Service.getMy(user);
      return Res.success(res, "My classes retrieved successfully", classes);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- create class --------------------
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const class_id = await Service.create(req.validated.body);
      return Res.success(res, "Class created successfully", class_id);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- update classes --------------------
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.update(req.validated.params, req.validated.body);
      return Res.success(res, "Class updated successfully");
    } catch (error) {
      next(error);
    }
  },
};
