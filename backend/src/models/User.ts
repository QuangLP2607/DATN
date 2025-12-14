import { Schema, model } from "mongoose";
import {
  IUserBase,
  IAdmin,
  IStudent,
  ITeacher,
  Roles,
} from "@/interfaces/user";

/* -------------------------------- BASE USER ------------------------------- */
const userSchema = new Schema<IUserBase>(
  {
    username: { type: String, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      required: true,
      enum: Object.keys(Roles),
    },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
    strict: true,
    strictQuery: true,
  }
);

export const UserModel = model<IUserBase>("User", userSchema, "users");

/* --------------------------------- ADMIN --------------------------------- */
const adminSchema = new Schema({});
export const AdminModel = UserModel.discriminator<IAdmin>("ADMIN", adminSchema);

/* -------------------------------- STUDENT -------------------------------- */
const studentSchema = new Schema<IStudent>({
  full_name: { type: String, default: "" },
  avatar_url: String,
  dob: Date,
  phone: { type: String, index: true },
  address: String,
  japaneseLevel: {
    type: String,
    enum: ["Không", "N5", "N4", "N3", "N2", "N1"],
    default: "Không",
  },
  note: String,
  lastLogin: Date,
});

export const StudentModel = UserModel.discriminator<IStudent>(
  "STUDENT",
  studentSchema
);

/* -------------------------------- TEACHER -------------------------------- */
const teacherSchema = new Schema<ITeacher>({
  full_name: { type: String, default: "" },
  avatar_url: String,
  dob: Date,
  phone: { type: String, index: true },
  address: String,
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "active",
  },
  note: String,
});

export const TeacherModel = UserModel.discriminator<ITeacher>(
  "TEACHER",
  teacherSchema
);
