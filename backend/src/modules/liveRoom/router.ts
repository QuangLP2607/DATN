import express from "express";
import Controller from "./controller";
import { authMiddleware } from "@/middlewares/auth";
import { validateZod } from "@/middlewares/validateZod";
import { roleMiddleware } from "@/middlewares/role";
import { CreateLiveRoomSchema } from "./dto/create";
import { JoinLiveRoomSchema } from "./dto/join";
import { paramIdSchema } from "@/utils/zod";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({ body: CreateLiveRoomSchema }),
  Controller.createRoom
);

router.post(
  "/join",
  authMiddleware,
  validateZod({ body: JoinLiveRoomSchema }),
  Controller.joinRoom
);

router.post(
  "/:id/leave",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.leaveRoom
);
router.post(
  "/:id/ping",
  authMiddleware,
  validateZod({ params: paramIdSchema() }),
  Controller.pingRoom
);

export default router;
