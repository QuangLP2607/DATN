import logo1 from "@/assets/logo/logo-icon.png";
import logo2 from "@/assets/logo/logo-text.png";
import type { MenuGroup } from "@/components/layout/Sidebar";
import Sidebar from "@/components/layout/Sidebar";
import authApi from "@/services/authService";

const adminMenu: MenuGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { to: "/admin/home", icon: "tabler:home", label: "Trang chủ" },
      { to: "/admin/schedule", icon: "tabler:calendar", label: "Lịch dạy" },
      { to: "/admin/course", icon: "tabler:book", label: "Khóa học" },
      {
        to: "/admin/class",
        icon: "tabler:chalkboard-teacher",
        label: "Lớp học",
      },
    ],
  },
  {
    title: "Người dùng",
    items: [
      { to: "/admin/students", icon: "tabler:school", label: "Học viên" },
      { to: "/admin/teachers", icon: "tabler:chalkboard", label: "Giảng viên" },
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
    ],
  },
];

export default function AdminSidebar() {
  const handleLogout = async () => {
    await authApi.logout();
    window.location.href = "/login";
  };

  return (
    <Sidebar
      logout={handleLogout}
      menuGroups={adminMenu}
      logo={{ small: logo1, large: logo2 }}
    />
  );
}
