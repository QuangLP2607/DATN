import { Router } from "express";
import Controller from "./controller";
import { authMiddleware } from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/role";
import { validateZod } from "@/middlewares/validateZod";
import { CreateEnrollmentSchema } from "./dto/createEnrollment";
import { EnrollmentIdParamsSchema } from "./dto/deleteEnrollment";

const router = Router();

router.use(authMiddleware);

router.get("/me", Controller.getMyEnrollments);

router.get(
  "/student/:id",
  roleMiddleware(["ADMIN", "TEACHER"]),
  validateZod({ params: EnrollmentIdParamsSchema }),
  Controller.getByStudentId
);

router.post(
  "/",
  roleMiddleware(["ADMIN"]),
  validateZod({ body: CreateEnrollmentSchema }),
  Controller.create
);

router.delete(
  "/:id",
  roleMiddleware(["ADMIN"]),
  validateZod({ params: EnrollmentIdParamsSchema }),
  Controller.remove
);

export default router;
