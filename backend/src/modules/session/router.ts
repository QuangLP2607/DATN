import { Router } from "express";
import Controller from "./controller";
import { authMiddleware } from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/role";
import { validateZod } from "@/middlewares/validateZod";
import { SearchSessionSchema } from "./dto/searchSession";
import { CreateSessionSchema } from "./dto/createSession";
import {
  SessionIdParamsSchema,
  UpdateSessionSchema,
} from "./dto/updateSession";

const router = Router();

router.use(authMiddleware);

router.get("/", validateZod({ query: SearchSessionSchema }), Controller.search);

router.post(
  "/",
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({ body: CreateSessionSchema }),
  Controller.create
);

router.patch(
  "/:id",
  roleMiddleware(["TEACHER", "ADMIN"]),
  validateZod({
    params: SessionIdParamsSchema,
    body: UpdateSessionSchema,
  }),
  Controller.update
);

export default router;
