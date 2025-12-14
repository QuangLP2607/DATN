import "dotenv/config";
import mongoose from "mongoose";

// Import các seed function riêng
import seedStudents from "./seedStudents";
import seedTeachers from "./seedTeachers";
import seedCourses from "./seedCourses";
import seedClasses from "./seedClasses";
import seedEnrollments from "./seedEnrollments";

async function seedAll() {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error("MONGO_URI missing");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    console.log("⏳ Seeding teachers...");
    await seedTeachers(50); // tạo giáo viên trước

    console.log("⏳ Seeding courses...");
    await seedCourses(); // tạo khóa học

    console.log("⏳ Seeding students...");
    await seedStudents(1000); // tạo học sinh

    console.log("⏳ Seeding classes...");
    await seedClasses(20); // tạo lớp học dựa trên teacher + course

    console.log("⏳ Seeding enrollments...");
    await seedEnrollments(500); // tạo enrollment dựa trên student + class

    console.log("🎉 All data seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  }
}

seedAll();
