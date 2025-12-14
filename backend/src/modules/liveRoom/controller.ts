import { Request, Response, NextFunction } from "express";
import { createRoomService, joinRoomService } from "./service";

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createRoomService(req.body, req.user);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const joinRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await joinRoomService(req.body, req.user);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
