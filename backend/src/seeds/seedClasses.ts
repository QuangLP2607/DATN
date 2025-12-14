import mongoose from "mongoose";
import "dotenv/config";

import { ClassModel } from "@/models/Class";
import { CourseModel } from "@/models/Course";
import { TeacherModel } from "@/models/User";
import { faker } from "@faker-js/faker";
import { generateSchedule, getCourseDuration } from "./seed.helpers";

export default async function seedClasses(count: number) {
  const courses = await CourseModel.find();
  const teachers = await TeacherModel.find({ role: "TEACHER" });

  if (!courses.length || !teachers.length) {
    throw new Error("Need existing courses and teachers");
  }

  const classes = [];

  for (let i = 0; i < count; i++) {
    const course = faker.helpers.arrayElement(courses);
    const durationMonths = getCourseDuration(course.name);

    const startDate = faker.date.between({
      from: "2025-01-01",
      to: "2025-06-01",
    });
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    classes.push({
      name: `${course.name} - Lớp ${faker.string
        .alphanumeric(4)
        .toUpperCase()}`,
      course_id: course._id,
      teacher_ids: faker.helpers.arrayElements(
        teachers.map((t) => t._id),
        1
      ),
      start_date: startDate,
      end_date: endDate,
      schedule: generateSchedule(),
      status: "upcoming",
    });
  }

  await ClassModel.insertMany(classes);
  console.log(`✅ ${count} classes inserted`);
}
