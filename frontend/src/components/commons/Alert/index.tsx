import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Alert.module.scss";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { AlertProps } from "@interfaces/alert";

const cx = classNames.bind(styles);

const iconMap: Record<AlertProps["alert"]["type"], string> = {
  success: "ix:success-filled",
  error: "ix:error-filled",
  warning: "ix:info-filled",
};

export default function Alert({ alert, clearAlert }: AlertProps) {
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(clearAlert, 5000);
    return () => clearTimeout(timer);
  }, [alert, clearAlert]);

  const icon = iconMap[alert.type];

  return (
    <div className={cx("alert", alert.type, "show")}>
      <Icon icon={icon} className={cx("alert-icon")} />
      <div className={cx("alert-wrapper")}>
        {alert.title && <div className={cx("alert-title")}>{alert.title}</div>}
        {alert.content && (
          <span className={cx("alert-content")}>{alert.content}</span>
        )}
      </div>
      <button className={cx("close")} onClick={clearAlert}>
        &times;
      </button>
      <div className={cx("progress")} />
    </div>
  );
}
