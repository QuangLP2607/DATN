export interface CourseInfo {
  _id: string;
  code: string;
  name: string;
  description: string;
  total_lessons: number;
}

export interface StudentCourseItem {
  enrollment_id: string;
  class_name: string;
  class_status: "upcoming" | "active" | "finished";
  course: CourseInfo;
}

export interface StudentCourseResponse {
  total_courses: number;
  courses: StudentCourseItem[];
}
