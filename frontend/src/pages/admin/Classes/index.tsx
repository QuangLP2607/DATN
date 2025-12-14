import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Classes.module.scss";

import Pagination from "@components/commons/Pagination";
import { TableView } from "@components/commons/TableView";
import classApi from "@services/classService";

const cx = classNames.bind(styles);

type Class = {
  _id: string;
  name: string;
  course_id: {
    _id: string;
    code: string;
    name: string;
  };
  teacher_ids: { _id: string; full_name: string; email: string }[];
  start_date: string;
  end_date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Class>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classApi.getAllClasses({
          page: currentPage - 1,
          limit: rowsPerPage,
          search,
          sortField,
          sortOrder,
        });
        const { items, pagination } = res.data.data;
        setClasses(items);
        setTotalPages(pagination.totalPages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClasses();
  }, [search, currentPage, rowsPerPage, sortField, sortOrder]);

  const columns = [
    {
      title: "STT",
      key: "index",
      align: "center" as const,
      render: (_: Class, idx: number) =>
        (currentPage - 1) * rowsPerPage + idx + 1,
    },
    { title: "Tên lớp", key: "name", align: "left" as const },
    {
      title: "Khóa học",
      key: "course_id",
      align: "left" as const,
      render: (row: Class) => row.course_id?.name || "",
    },
    {
      title: "Giáo viên",
      key: "teacher_ids",
      align: "left" as const,
      render: (row: Class) =>
        row.teacher_ids.map((t) => t.full_name).join(", "),
    },
    {
      title: "Trạng thái",
      key: "status",
      align: "center" as const,
      render: (row: Class) => row.status,
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      align: "center" as const,
      render: (row: Class) =>
        new Date(row.createdAt).toLocaleDateString("vi-VN"),
    },
  ];

  return (
    <div className={cx("classes")}>
      <div className={cx("classes__table")}>
        <TableView
          columns={columns}
          data={classes}
          rowKey="_id"
          onRowClick={(id) => navigate(`/classes/${id}`)}
          showRowsSelector
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(n) => {
            setRowsPerPage(n);
            setCurrentPage(1);
          }}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortField(field as keyof Class);
            setSortOrder(order);
          }}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSearchEnter={() => {
            setSearch(searchInput);
            setCurrentPage(1);
          }}
          searchPlaceholder="Tìm theo tên lớp hoặc khóa học..."
        />
      </div>

      <div className={cx("classes__pagination")}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={setCurrentPage}
        />
      </div>
    </div>
  );
}
