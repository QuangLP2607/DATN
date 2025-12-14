import AppError from "@/core/AppError";
import { EnrollmentModel } from "@/models/Enrollment";
import { ClassModel } from "@/models/Class";
import { UserModel } from "@/models/User";
import { CreateEnrollmentInput } from "./dto/createEnrollment";
import { EnrollmentIdParams } from "./dto/deleteEnrollment";
import { Types } from "mongoose";

export default {
  // -------------------- get enrollment by student id --------------------
  getByStudentId: async (studentId: string) => {
    return EnrollmentModel.find({
      student_id: new Types.ObjectId(studentId),
    }).lean();
  },

  // -------------------- enroll --------------------
  create: async (data: CreateEnrollmentInput) => {
    const [classExists, studentExists] = await Promise.all([
      ClassModel.exists({ _id: data.class_id }),
      UserModel.exists({ _id: data.student_id, role: "STUDENT" }),
    ]);

    if (!classExists) {
      throw AppError.notFound("Class not found");
    }

    if (!studentExists) {
      throw AppError.notFound("Student not found");
    }

    try {
      const enrollment = await EnrollmentModel.create({
        class_id: data.class_id,
        student_id: data.student_id,
        enrolled_at: new Date(),
      });

      return { id: enrollment._id };
    } catch (err: any) {
      if (err.code === 11000) {
        throw AppError.badRequest("Student already enrolled in this class");
      }
      throw err;
    }
  },

  // -------------------- unenroll (rare case) --------------------
  remove: async ({ id }: EnrollmentIdParams) => {
    const enrollment = await EnrollmentModel.findByIdAndDelete(id);

    if (!enrollment) {
      throw AppError.notFound("Enrollment not found");
    }
  },
};
