import mongoose from "mongoose";
import "dotenv/config";

import { TeacherModel } from "@/models/User";
import { faker } from "@faker-js/faker";
import {
  randomVietnameseName,
  generateUniqueUsername,
  randomVietnamesePhone,
  randomTeacherDOB,
} from "./seed.helpers";

export default async function seedTeachers(count: number) {
  const existingUsernames = new Set<string>();

  const teachers = Array.from({ length: count }).map(() => {
    const fullName = randomVietnameseName();
    const dob = randomTeacherDOB();

    const username = generateUniqueUsername(
      fullName,
      dob.getFullYear(),
      existingUsernames
    );

    return {
      username,
      email: `${username}@gmail.com`,
      password: "123456",
      role: "TEACHER",

      full_name: fullName,
      avatar_url: faker.image.avatar(),
      dob,
      phone: randomVietnamesePhone(),
      status: "active",
    };
  });

  await TeacherModel.insertMany(teachers);
  console.log(`✅ ${count} teachers inserted`);
}
