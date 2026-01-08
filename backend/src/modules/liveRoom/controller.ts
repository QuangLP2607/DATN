import { Request, Response, NextFunction } from "express";
import Service from "./service";

export default {
  // -------------------- create room --------------------
  createRoom: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const result = await Service.createRoom(req.validated.body, user.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  // -------------------- join room --------------------
  joinRoom: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const result = await Service.joinRoom(req.validated.body, user.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  // -------------------- leave room --------------------
  leaveRoom: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.leaveRoom(req.validated.params, req.user!.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  // -------------------- ping room --------------------
  pingRoom: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Service.pingRoom(req.validated.params, req.user!.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },
};
