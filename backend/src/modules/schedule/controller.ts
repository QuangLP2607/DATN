import { Request, Response, NextFunction } from "express";
import Service from "./service";
import { Res } from "@/core/response";

export default {
  // -------------------- search schedules --------------------
  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schedules = await Service.search(req.validated.query);
      return Res.success(res, "Get schedules successfully", schedules);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- create schedule --------------------
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schedule_id = await Service.create(req.validated.body);
      return Res.created(res, "Schedule created successfully", schedule_id);
    } catch (error) {
      next(error);
    }
  },

  // -------------------- update schedule --------------------
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.validated.params;
      await Service.update(id, req.validated.body);
      return Res.success(res, "Schedule updated successfully");
    } catch (error) {
      next(error);
    }
  },

  // -------------------- delete schedule --------------------
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.validated.params;
      await Service.remove(id);
      return Res.success(res, "Schedule deleted successfully");
    } catch (error) {
      next(error);
    }
  },
};
