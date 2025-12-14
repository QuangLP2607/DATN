import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import ConfirmModal from "@/components/ConfirmModal";
import ThemeSwitch from "@/components/ThemeSwitch";
import NotificationMenu from "./components/NotificationMenu";
import UserMenu from "./components/UserMenu";

const cx = classNames.bind(styles);

export interface MenuItem {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface NotificationItem {
  id: string | number;
  title: string;
  description?: string;
  href?: string;
}

export interface HeaderProps {
  menuItems?: MenuItem[];
  avatarUrl?: string | null;
  logout?: () => void;
  notifications?: NotificationItem[];
}

export default function Header({
  menuItems = [],
  avatarUrl,
  logout,
  notifications = [],
}: HeaderProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className={cx("header")}>
      <div className={cx("header__actions")}>
        <ThemeSwitch />
        <NotificationMenu notifications={notifications} />
        <UserMenu
          avatarUrl={avatarUrl}
          menuItems={menuItems}
          onLogout={() => setShowLogoutConfirm(true)}
        />
      </div>

      <ConfirmModal
        open={showLogoutConfirm}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc muốn đăng xuất?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          logout?.();
          setShowLogoutConfirm(false);
        }}
      />
    </div>
  );
}
