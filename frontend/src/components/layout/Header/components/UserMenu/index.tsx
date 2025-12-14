import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./UserMenu.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface MenuItem {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface Props {
  avatarUrl?: string | null;
  menuItems?: MenuItem[];
  onLogout?: () => void;
}

export default function UserMenu({
  avatarUrl,
  menuItems = [],
  onLogout,
}: Props) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(e.target as Node)
    ) {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className={cx("avatar")}
      ref={userMenuRef}
      onClick={(e) => {
        e.stopPropagation();
        setShowUserMenu((prev) => !prev);
      }}
    >
      {!avatarUrl || imgError ? (
        <Icon className={cx("avatar-icon")} icon="si:user-fill" />
      ) : (
        <img
          className={cx("avatar-img")}
          src={avatarUrl}
          alt="Avatar"
          draggable={false}
          onError={() => setImgError(true)}
        />
      )}

      {showUserMenu && (
        <div className={cx("avatar__dropdown")}>
          {menuItems.map((item, idx) => {
            const Comp = item.href ? "a" : "div";
            return (
              <Comp
                key={idx}
                className={cx("avatar__dropdown-item")}
                href={item.href}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick?.();
                  setShowUserMenu(false);
                }}
              >
                <Icon icon={item.icon} /> {item.label}
              </Comp>
            );
          })}
          <div
            className={cx("avatar__dropdown-item")}
            onClick={(e) => {
              e.stopPropagation();
              onLogout?.();
            }}
          >
            <Icon icon="material-symbols:logout" /> Đăng xuất
          </div>
        </div>
      )}
    </div>
  );
}
