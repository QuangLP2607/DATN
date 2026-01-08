import { useState } from "react";
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
  open: boolean;
  onToggle: () => void;
  onLogout?: () => void;
}

export default function UserMenu({
  avatarUrl,
  menuItems = [],
  open,
  onToggle,
  onLogout,
}: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={cx("avatar")}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {/* Avatar trigger */}
      <div className={cx("avatar__trigger")}>
        {!avatarUrl || imgError ? (
          <Icon
            className={cx("avatar-icon")}
            icon="si:user-fill"
            width={24}
            height={24}
          />
        ) : (
          <img
            className={cx("avatar-img")}
            src={avatarUrl}
            alt="Avatar"
            draggable={false}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className={cx("avatar__dropdown")}>
          {menuItems.map((item, idx) => {
            const Comp = item.href ? "a" : "div";
            return (
              <Comp
                key={idx}
                href={item.href}
                className={cx("avatar__dropdown-item")}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick?.();
                  onToggle();
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
              onToggle();
            }}
          >
            <Icon icon="material-symbols:logout" width={18} height={18} /> Đăng
            xuất
          </div>
        </div>
      )}
    </div>
  );
}
