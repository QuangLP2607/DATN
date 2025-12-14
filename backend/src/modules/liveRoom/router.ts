import express from "express";
import { createRoom, joinRoom } from "./controller";
import { authMiddleware } from "@/middlewares/auth";
import { validateZod } from "@/middlewares/validateZod";
import { roleMiddleware } from "@/middlewares/role";
import { CreateLiveRoomSchema, JoinLiveRoomSchema } from "./dto/liveRoom";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({ body: CreateLiveRoomSchema }),
  createRoom
);

router.post(
  "/join",
  authMiddleware,
  validateZod({ body: JoinLiveRoomSchema }),
  joinRoom
);

export default router;
