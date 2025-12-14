import { useEffect,useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Dropdown.module.scss";

import { Icon } from "@iconify/react/dist/iconify.js";

const cx = classNames.bind(styles);

interface Option {
  label: string;
  value: string | number;
}

interface DropdownProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  label?: string;
}

export function Dropdown({ value, onChange, options, label }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={cx("dropdown")} ref={ref}>
      {label && <span className={cx("dropdown__label")}>{label}</span>}

      <div className={cx("dropdown__control")} onClick={() => setOpen(!open)}>
        <span>{selected?.label}</span>
        <span className={cx("dropdown__arrow", { open })}>
          <Icon icon="iconamoon:arrow-down-2-bold" />
        </span>
        {open && (
          <ul className={cx("dropdown__menu")}>
            {options.map((opt) => (
              <li
                key={opt.value}
                className={cx("dropdown__item")}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}{" "}
      </div>
    </div>
  );
}
