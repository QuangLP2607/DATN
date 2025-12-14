import classNames from "classnames/bind";
import styles from "./SearchBar.module.scss";

import { Icon } from "@iconify/react/dist/iconify.js";

const cx = classNames.bind(styles);

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onEnter?: () => void;
}

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onEnter,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnter?.();
    }
  };

  const handleIconClick = () => {
    onEnter?.();
  };

  return (
    <div className={cx("search-bar")}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cx("search-bar__input")}
      />
      <span
        className={cx("search-bar__icon")}
        onClick={handleIconClick}
        style={{ cursor: "pointer" }}
      >
        <Icon icon="tabler:search" />
      </span>
    </div>
  );
}

export default SearchBar;
