import classNames from "classnames/bind";
import styles from "./Pagination.module.scss";

import { Icon } from "@iconify/react";

const cx = classNames.bind(styles);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  siblingCount?: number; // số trang hiển thị xung quanh currentPage
}

export default function Pagination({
  currentPage,
  totalPages,
  onChangePage,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages === 0) return null;

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  let pages: (number | string)[] = [];

  if (totalPages <= 5 + siblingCount * 2) {
    pages = range(1, totalPages);
  } else {
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, 3 + 2 * siblingCount);
      pages = [...leftRange, "...", totalPages];
    } else if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - (2 + 2 * siblingCount), totalPages);
      pages = [1, "...", ...rightRange];
    } else {
      const middleRange = range(leftSibling, rightSibling);
      pages = [1, "...", ...middleRange, "...", totalPages];
    }
  }

  return (
    <div className={cx("pagination")}>
      <button
        disabled={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
        className={cx("pagination__button")}
      >
        <Icon icon="material-symbols:arrow-back-ios-new-rounded" />
      </button>

      {pages.map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={idx}
            onClick={() => onChangePage(p)}
            className={cx("pagination__button", { active: p === currentPage })}
          >
            {p}
          </button>
        ) : (
          <span key={idx} className={cx("pagination__dots")}>
            {p}
          </span>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onChangePage(currentPage + 1)}
        className={cx("pagination__button")}
      >
        <Icon icon="material-symbols:arrow-forward-ios-rounded" />
      </button>
    </div>
  );
}
