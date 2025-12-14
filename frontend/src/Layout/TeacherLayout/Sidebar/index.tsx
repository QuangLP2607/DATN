import logo1 from "@/assets/logo/logo-icon.png";
import logo2 from "@/assets/logo/logo-text.png";
import type { MenuGroup } from "@/components/layout/Sidebar";
import Sidebar from "@/components/layout/Sidebar";

const teacherMenu: MenuGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { to: "/teacher/home", icon: "tabler:home", label: "Trang chủ" },
      { to: "/teacher/schedule", icon: "tabler:calendar", label: "Lịch dạy" },
      { to: "/teacher/course", icon: "tabler:book", label: "Khóa học" },
    ],
  },
  {
    title: "Người dùng",
    items: [
      { to: "/teacher/lectures", icon: "tabler:school", label: "Học viên" },
      {
        to: "/teacher/teachers",
        icon: "tabler:chalkboard",
        label: "Giảng viên",
      },
    ],
  },
  {
    title: "Cài đặt",
    items: [
      {
        to: "/profile",
        icon: "hugeicons:user-settings-01",
        label: "Tài khoản",
      },
      { to: "/logout", icon: "tabler:logout", label: "Đăng xuất" },
    ],
  },
];

export default function TeacherSidebar() {
  return (
    <Sidebar menuGroups={teacherMenu} logo={{ small: logo1, large: logo2 }} />
  );
}
