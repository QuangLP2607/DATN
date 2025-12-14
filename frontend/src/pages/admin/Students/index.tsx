import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Students.module.scss";

import Pagination from "@components/commons/Pagination";
import { TableView } from "@components/commons/TableView";
import userApi from "@/services/userService1";

const cx = classNames.bind(styles);

type Student = {
  _id: string;
  username: string;
  email: string;
  dob?: string;
  phone?: string;
  status: string;
  note?: string;
  created_at: string;
};

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Student>("username");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await userApi.getUsersByRole({
          role: "student",
          page: currentPage,
          limit: rowsPerPage,
          sort: sortField,
          order: sortOrder,
          search,
        });
        const { items, pagination } = res.data.data;
        setStudents(items);
        setTotalPages(pagination.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, [search, currentPage, rowsPerPage, sortField, sortOrder]);

  const columns = [
    {
      title: "STT",
      key: "index",
      align: "center" as const,
      render: (_: Student, idx: number) =>
        (currentPage - 1) * rowsPerPage + idx + 1,
    },
    { title: "Họ và tên", key: "username", align: "left" as const },
    { title: "Email", key: "email", align: "left" as const },
    {
      title: "Ngày sinh",
      key: "dob",
      align: "center" as const,
      render: (row: Student) =>
        row.dob ? new Date(row.dob).toLocaleDateString("vi-VN") : "",
    },
    { title: "Số điện thoại", key: "phone", align: "center" as const },
    { title: "Trạng thái", key: "status", align: "center" as const },
    {
      title: "Ngày tạo",
      key: "created_at",
      align: "center" as const,
      render: (row: Student) =>
        row.created_at
          ? new Date(row.created_at).toLocaleDateString("vi-VN")
          : "",
    },
    {
      title: "Ghi chú",
      key: "note",
      align: "left" as const,
      style: {
        maxWidth: "100px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
  ];

  return (
    <div className={cx("student")}>
      <div className={cx("student__table")}>
        <TableView
          columns={columns}
          data={students}
          rowKey="_id"
          onRowClick={(id) => navigate(`/students/${id}`)}
          showRowsSelector
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(n) => {
            setRowsPerPage(n);
            setCurrentPage(1);
          }}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortField(field as keyof Student);
            setSortOrder(order);
          }}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSearchEnter={() => {
            setSearch(searchInput);
            setCurrentPage(1);
          }}
          searchPlaceholder="Tìm theo tên học viên..."
        />
      </div>

      <div className={cx("student__pagination")}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={setCurrentPage}
        />
      </div>
    </div>
  );
}
