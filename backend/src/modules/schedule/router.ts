import { Router } from "express";
import Controller from "./controller";
import { authMiddleware } from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/role";
import { validateZod } from "@/middlewares/validateZod";
import { SearchScheduleSchema } from "./dto/searchSchedule";
import { CreateScheduleSchema } from "./dto/createSchedule";
import {
  ScheduleIdParamsSchema,
  UpdateScheduleSchema,
} from "./dto/updateSchedule";

const router = Router();

router.use(authMiddleware);

router.get(
  "/",
  validateZod({ query: SearchScheduleSchema }),
  Controller.search
);

router.post(
  "/",
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({ body: CreateScheduleSchema }),
  Controller.create
);

router.patch(
  "/:id",
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({
    params: ScheduleIdParamsSchema,
    body: UpdateScheduleSchema,
  }),
  Controller.update
);

router.delete(
  "/:id",
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({ params: ScheduleIdParamsSchema }),
  Controller.remove
);

export default router;
