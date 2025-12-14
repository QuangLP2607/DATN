import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ModalForm.module.scss";

import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

export interface ModalFormProps<T> {
  open: boolean;
  title: string;
  initialData?: Partial<T>;
  fields: {
    name: keyof T;
    label: string;
    type?: "text" | "number" | "textarea";
    placeholder?: string;
  }[];
  onClose: () => void;
  onSubmit: (data: T) => void;
}

export default function FormModal<T>({
  open,
  title,
  initialData = {},
  fields,
  onClose,
  onSubmit,
}: ModalFormProps<T>) {
  const [form, setForm] = useState<Partial<T>>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (key: keyof T, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form as T);
  };

  if (!open) return null;

  return (
    <div className={cx("overlay")}>
      <div className={cx("modal")}>
        <div className={cx("header")}>
          <h3>{title}</h3>
          <button onClick={onClose} className={cx("close-btn")}>
            <Icon icon="mdi:close" width={20} height={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={cx("form")}>
          {fields.map((f) => (
            <div key={String(f.name)} className={cx("field")}>
              <label>{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  placeholder={f.placeholder}
                  value={(form[f.name] as string) || ""}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
              ) : (
                <input
                  type={f.type || "text"}
                  placeholder={f.placeholder}
                  value={(form[f.name] as string | number | undefined) || ""}
                  onChange={(e) =>
                    handleChange(
                      f.name,
                      f.type === "number"
                        ? Number(e.target.value)
                        : e.target.value
                    )
                  }
                />
              )}
            </div>
          ))}

          <div className={cx("actions")}>
            <button
              type="button"
              onClick={onClose}
              className={cx("btn", "cancel")}
            >
              Hủy
            </button>
            <button type="submit" className={cx("btn", "submit")}>
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
