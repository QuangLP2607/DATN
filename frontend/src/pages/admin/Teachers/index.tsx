import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Teachers.module.scss";

import Pagination from "@components/commons/Pagination";
import { TableView } from "@components/commons/TableView";
import userApi from "@/services/userService1";

const cx = classNames.bind(styles);

type Teacher = {
  _id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  department?: string;
  status: string;
  created_at: string;
};

export default function Teachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Teacher>("username");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await userApi.getUsersByRole({
          role: "teacher",
          page: currentPage,
          limit: rowsPerPage,
          sort: sortField,
          order: sortOrder,
          search,
        });
        const { items, pagination } = res.data.data;
        setTeachers(items);
        setTotalPages(pagination.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeachers();
  }, [search, currentPage, rowsPerPage, sortField, sortOrder]);

  const columns = [
    {
      title: "STT",
      key: "index",
      align: "center" as const,
      render: (_: Teacher, idx: number) =>
        (currentPage - 1) * rowsPerPage + idx + 1,
    },
    { title: "Tên đăng nhập", key: "username", align: "left" as const },
    { title: "Họ và tên", key: "full_name", align: "left" as const },
    { title: "Email", key: "email", align: "left" as const },
    { title: "Số điện thoại", key: "phone", align: "center" as const },
    // { title: "Bộ môn", key: "department", align: "center" as const },
    { title: "Trạng thái", key: "status", align: "center" as const },
    {
      title: "Ngày tạo",
      key: "created_at",
      align: "center" as const,
      render: (row: Teacher) =>
        row.created_at
          ? new Date(row.created_at).toLocaleDateString("vi-VN")
          : "",
    },
  ];

  return (
    <div className={cx("teacher")}>
      <div className={cx("teacher__table")}>
        <TableView
          columns={columns}
          data={teachers}
          rowKey="_id"
          onRowClick={(id) => navigate(`/teachers/${id}`)}
          showRowsSelector
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(n) => {
            setRowsPerPage(n);
            setCurrentPage(1);
          }}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortField(field as keyof Teacher);
            setSortOrder(order);
          }}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSearchEnter={() => {
            setSearch(searchInput);
            setCurrentPage(1);
          }}
          searchPlaceholder="Tìm theo tên giáo viên..."
        />
      </div>

      <div className={cx("teacher__pagination")}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={setCurrentPage}
        />
      </div>
    </div>
  );
}
