import { Router } from "express";
import { getStudentsByMonth, getStudentsPerCourse } from "./controller";
import { authMiddleware } from "@/middlewares/auth";

const router = Router();

// GET /stats/students/monthly
router.get("/students/monthly", authMiddleware, getStudentsByMonth);

// GET /stats/courses/students
router.get("/courses/students", authMiddleware, getStudentsPerCourse);

export default router;
