import React from "react";
import classNames from "classnames/bind";
import styles from "./TableView.module.scss";

import { Dropdown } from "@components/commons/Dropdown";
import SearchBar from "@components/commons/SearchBar";

const cx = classNames.bind(styles);

interface Column<T> {
  title: string;
  key: keyof T | string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  style?: React.CSSProperties;
}

interface TableViewProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T | string;
  onRowClick?: (id: string | number) => void;

  /** SEARCH */
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  onSearchEnter?: () => void;
  searchPlaceholder?: string;

  /** ROWS */
  showRowsSelector?: boolean;
  rowsPerPage?: number;
  onRowsPerPageChange?: (value: number) => void;
  rowsOptions?: number[];

  /** SORT */
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: string, order: "asc" | "desc") => void;
}

export function TableView<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  onRowClick,
  searchValue,
  onSearchChange,
  onSearchEnter,
  searchPlaceholder = "Tìm kiếm...",
  showRowsSelector = false,
  rowsPerPage = 10,
  onRowsPerPageChange,
  rowsOptions = [5, 10, 20],
  sortField,
  sortOrder,
  onSortChange,
}: TableViewProps<T>) {
  const sortFieldOptions = columns
    .filter((c) => c.key !== "index")
    .map((c) => ({ label: c.title, value: c.key as string }));

  const sortOrderOptions = [
    { label: "Tăng dần", value: "asc" },
    { label: "Giảm dần", value: "desc" },
  ];

  return (
    <div className={cx("table__wrapper")}>
      {/* HEADER */}
      {onSearchChange && (
        <div className={cx("table__header")}>
          <SearchBar
            value={searchValue || ""}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            onEnter={onSearchEnter}
          />

          <div className={cx("table__header-sort")}>
            <Dropdown
              label="Sắp xếp theo"
              value={sortField || ""}
              onChange={(val) =>
                onSortChange?.(val as string, sortOrder || "asc")
              }
              options={sortFieldOptions}
            />

            <Dropdown
              label="Thứ tự"
              value={sortOrder || "asc"}
              onChange={(val) =>
                onSortChange?.(sortField || "full_name", val as "asc" | "desc")
              }
              options={sortOrderOptions}
            />
          </div>
        </div>
      )}

      {/* TABLE */}
      {data && data.length > 0 ? (
        <table className={cx("table")}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  style={col.style}
                  className={cx(
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right"
                  )}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row[rowKey] as React.Key}
                className={onRowClick ? cx("table__row-clickable") : ""}
                onClick={() => onRowClick?.(row[rowKey] as string | number)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key as string}
                    style={col.style}
                    className={cx(
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right"
                    )}
                  >
                    {col.render
                      ? col.render(row, index)
                      : (row[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={cx("table__empty")}>Không có dữ liệu</p>
      )}

      {/* FOOTER */}
      {showRowsSelector && (
        <div className={cx("table__footer")}>
          <Dropdown
            label="Số bản ghi"
            value={rowsPerPage}
            onChange={(val) => onRowsPerPageChange?.(Number(val))}
            options={rowsOptions.map((opt) => ({
              label: `${opt}`,
              value: opt,
            }))}
          />
        </div>
      )}
    </div>
  );
}
