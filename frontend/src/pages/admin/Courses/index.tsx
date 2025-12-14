import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Courses.module.scss";

import Pagination from "@components/commons/Pagination";
import { TableView } from "@components/commons/TableView";
import courseApi from "@services/courseService"; // api tương tự userApi

const cx = classNames.bind(styles);

type Course = {
  _id: string;
  code: string;
  name: string;
  description?: string;
  total_lessons: number;
  is_active: boolean;
  total_classes: number;
  active_classes: number;
  createdAt: string;
  updatedAt: string;
};

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Course>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseApi.getAllCourses({
          page: currentPage,
          limit: rowsPerPage,
          search,
          sort: sortField,
          order: sortOrder,
        });
        const { items, pagination } = res.data.data;
        setCourses(items);
        setTotalPages(pagination.totalPages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, [search, currentPage, rowsPerPage, sortField, sortOrder]);

  const columns = [
    {
      title: "STT",
      key: "index",
      align: "center" as const,
      render: (_: Course, idx: number) =>
        (currentPage - 1) * rowsPerPage + idx + 1,
    },
    { title: "Mã khóa học", key: "code", align: "left" as const },
    { title: "Tên khóa học", key: "name", align: "left" as const },
    // {
    //   title: "Số buổi",
    //   key: "total_lessons",
    //   align: "center" as const,
    // },
    // {
    //   title: "Trạng thái",
    //   key: "is_active",
    //   align: "center" as const,
    //   render: (row: Course) => (row.is_active ? "Hoạt động" : "Ngưng"),
    // },
    {
      title: "Tổng số lớp học",
      key: "total_classes",
      align: "center" as const,
      render: (row: Course) => row.total_classes,
    },
    {
      title: "Số lớp đang hoạt động",
      key: "active_classes",
      align: "center" as const,
      render: (row: Course) => row.active_classes,
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      align: "center" as const,
      render: (row: Course) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("vi-VN")
          : "",
    },
  ];

  return (
    <div className={cx("courses")}>
      <div className={cx("courses__table")}>
        <TableView
          columns={columns}
          data={courses}
          rowKey="_id"
          onRowClick={(id) => navigate(`/courses/${id}`)}
          showRowsSelector
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(n) => {
            setRowsPerPage(n);
            setCurrentPage(1);
          }}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortField(field as keyof Course);
            setSortOrder(order);
          }}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSearchEnter={() => {
            setSearch(searchInput);
            setCurrentPage(1);
          }}
          searchPlaceholder="Tìm theo tên hoặc mã khóa học..."
        />
      </div>

      <div className={cx("courses__pagination")}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={setCurrentPage}
        />
      </div>
    </div>
  );
}
