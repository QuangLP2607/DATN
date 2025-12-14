import mongoose from "mongoose";
import "dotenv/config";

import { StudentModel } from "@/models/User";
import {
  randomVietnameseName,
  generateUniqueUsername,
  randomVietnamesePhone,
  randomStudentDOB,
} from "./seed.helpers";

export default async function seedStudents(count: number) {
  const existingUsernames = new Set<string>();

  const students = Array.from({ length: count }).map(() => {
    const fullName = randomVietnameseName();
    const dob = randomStudentDOB();

    const username = generateUniqueUsername(
      fullName,
      dob.getFullYear(),
      existingUsernames
    );

    return {
      username,
      email: `${username}@gmail.com`,
      password: "123456",
      role: "STUDENT",

      full_name: fullName,
      dob,
      phone: randomVietnamesePhone(),
      japaneseLevel: "Không",
    };
  });

  await StudentModel.insertMany(students);
  console.log(`✅ ${count} students inserted`);
}
