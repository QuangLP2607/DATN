import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { Icon } from "@iconify/react";
import ConfirmModal from "@/components/ConfirmModal";

const cx = classNames.bind(styles);

export interface MenuItem {
  to: string;
  icon: string;
  label: string;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface SidebarProps {
  menuGroups: MenuGroup[];
  logo?: { small: string; large: string };
  logout?: () => void;
}

export default function Sidebar({ menuGroups, logo, logout }: SidebarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    return localStorage.getItem("sidebar-expanded") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", String(isExpanded));
  }, [isExpanded]);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <aside className={cx("sidebar", { expanded: isExpanded })}>
      {/* Logo */}
      <Link to="/xxx" className={cx("sidebar__logo")}>
        {logo && (
          <>
            <img
              src={logo.small}
              alt="Logo"
              className={cx("sidebar__logo-img")}
            />
            {isExpanded && (
              <img
                src={logo.large}
                alt="Logo"
                className={cx("sidebar__logo-img")}
              />
            )}
          </>
        )}
      </Link>

      {/* Menu */}
      <ul className={cx("sidebar__menu")}>
        {menuGroups.map((group) => (
          <li key={group.title} className={cx("sidebar__submenu")}>
            <div className={cx("sidebar__submenu-title")}>
              <hr className={cx("sidebar__submenu-title-line")} />
              <span className={cx("sidebar__submenu-title-text")}>
                {group.title}
              </span>
            </div>

            <ul className={cx("sidebar__submenu-list")}>
              {group.items.map((item) => {
                const isActive = location.pathname.startsWith(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cx("sidebar__submenu-item", {
                      active: isActive,
                    })}
                  >
                    <Icon icon={item.icon} className={cx("sidebar__icon")} />
                    <span className={cx("sidebar__content")}>{item.label}</span>
                  </Link>
                );
              })}
            </ul>
          </li>
        ))}

        {logout && (
          <li
            className={cx("sidebar__submenu-item", "logout")}
            onClick={() => setShowLogoutConfirm(true)}
          >
            <Icon icon="line-md:logout" className={cx("sidebar__icon")} />
            <span className={cx("sidebar__content")}>Đăng xuất</span>
          </li>
        )}
      </ul>

      {/* Toggle Button */}
      <button
        type="button"
        className={cx("sidebar__toggle")}
        onClick={toggleSidebar}
      >
        <Icon
          icon={
            isExpanded ? "line-md:menu-fold-left" : "line-md:menu-fold-right"
          }
        />
      </button>
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
    </aside>
  );
}
