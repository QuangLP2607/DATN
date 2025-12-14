import { Router } from "express";
import Controller from "./controller";
import { validateZod } from "@/middlewares/validateZod";
import { authMiddleware } from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/role";
import { SearchClassesSchema } from "./dto/searchClasses";
import { CreateClassSchema } from "./dto/createClass";
import { ClassIdParamsSchema, UpdateClassSchema } from "./dto/updateClass";

const router = Router();

router.get(
  "/",
  authMiddleware,
  validateZod({ query: SearchClassesSchema }),
  Controller.search
);

router.get(
  "/me",
  authMiddleware,
  roleMiddleware(["TEACHER"]),
  Controller.getMy
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ body: CreateClassSchema }),
  Controller.create
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateZod({ params: ClassIdParamsSchema, body: UpdateClassSchema }),
  Controller.update
);

export default router;
