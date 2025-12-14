import type { ReactElement, ReactNode } from "react";
import { StudentLayout } from "@/Layout";
import { TeacherLayout } from "@/Layout";
import { AdminLayout } from "@/Layout";

// public pages
import Login from "@/pages/Login";

// admin pages
// import AdminClasses from "@/pages/admin/Classes";
// import AdminCourses from "@/pages/admin/Courses";
import AdminHome from "@/pages/admin/Home";
// import AdminSchedule from "@/pages/admin/Schedule";
// import StudentDetail from "@/pages/admin/StudentDetail";
// import AdminStudents from "@/pages/admin/Students";
// import AdminTeachers from "@/pages/admin/Teachers";

// student pages
// import StudentChat from "@/pages/student/Chat";
// import StudentExercises from "@/pages/student/Exercises";
// import StudentHome from "@/pages/student/Home";
// import StudentLectures from "@/pages/student/Lectures";
// import StudentProfile from "@/pages/student/Profile";

// teacher pages
// import TeacherHome from "@/pages/teacher/Home";
// import TeacherLectures from "@/pages/teacher/Lectures";

import type { Role } from "@/models/User";

export interface RouteType {
  path: string;
  component: () => ReactElement;
  layout?: ((props: { children: ReactNode }) => ReactElement) | null;
  layoutProps?: {
    showHeader?: boolean;
    showSidebar?: boolean;
    showFooter?: boolean;
  };
  role?: Role;
}

/* ------------------------------
   Helpers to build role routes
------------------------------- */

const withStudent = (
  path: string,
  component: () => ReactElement
): RouteType => ({
  path: `/${path}`,
  component,
  role: "STUDENT",
  layout: StudentLayout,
  layoutProps: { showSidebar: true },
});

const withTeacher = (
  path: string,
  component: () => ReactElement
): RouteType => ({
  path: `/teacher${path}`,
  component,
  role: "TEACHER",
  layout: TeacherLayout,
});

const withAdmin = (path: string, component: () => ReactElement): RouteType => ({
  path: `/admin${path}`,
  component,
  role: "ADMIN",
  layout: AdminLayout,
});

/* ------------------------------
   Public routes
------------------------------- */

const publicRoutes: RouteType[] = [
  { path: "/login", component: Login, layout: null },
];

/* ------------------------------
   Private routes by role
------------------------------- */

const studentRoutes: RouteType[] = [
  // withStudent("/home", StudentHome),
  // withStudent("/lectures", StudentLectures),
  // withStudent("/exercises", StudentExercises),
  // withStudent("/chat", StudentChat),
  // withStudent("/profile", StudentProfile),
];

const teacherRoutes: RouteType[] = [
  // withTeacher("/home", TeacherHome),
  // withTeacher("/lectures", TeacherLectures),
];

const adminRoutes: RouteType[] = [
  withAdmin("/home", AdminHome),
  // withAdmin("/course", AdminCourses),
  // withAdmin("/class", AdminClasses),
  // withAdmin("/schedule", AdminSchedule),
  // withAdmin("/teachers", AdminTeachers),
  // withAdmin("/students", AdminStudents),
  // {
  //   ...withAdmin("/students/:id", StudentDetail),
  // },
];

/* ------------------------------
   Combined private routes
------------------------------- */

const privateRoutes = [...studentRoutes, ...teacherRoutes, ...adminRoutes];

export { privateRoutes, publicRoutes };
