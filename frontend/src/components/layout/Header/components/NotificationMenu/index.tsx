import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import styles from "./NotificationMenu.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface NotificationItem {
  id: string | number;
  title: string;
  description?: string;
  href?: string;
}

interface Props {
  notifications?: NotificationItem[];
}

export default function NotificationMenu({ notifications = [] }: Props) {
  const [showNotify, setShowNotify] = useState(false);
  const notifyRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (notifyRef.current && !notifyRef.current.contains(e.target as Node)) {
      setShowNotify(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className={cx("notification")}
      ref={notifyRef}
      onClick={(e) => {
        e.stopPropagation();
        setShowNotify((prev) => !prev);
      }}
    >
      <Icon className={cx("notification-icon")} icon="iconoir:bell" />
      {notifications.length > 0 && (
        <span className={cx("notification-dot")}>{notifications.length}</span>
      )}
      {showNotify && (
        <div className={cx("notification__dropdown")}>
          {notifications.length === 0 ? (
            <div className={cx("notification__dropdown-item")}>
              Không có thông báo
            </div>
          ) : (
            notifications.map((n) => {
              const Comp = n.href ? "a" : "div";
              return (
                <Comp
                  key={n.id}
                  className={cx("notification__dropdown-item")}
                  href={n.href}
                >
                  {n.title}
                  {n.description && (
                    <div className={cx("notification__dropdown-desc")}>
                      {n.description}
                    </div>
                  )}
                </Comp>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
