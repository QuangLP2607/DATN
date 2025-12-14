import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./StudentDetail.module.scss";

import avatar from "@assets/avatar.svg";
import type {
  StudentCourseItem,
  StudentCourseResponse,
} from "@interfaces/student";
import userApi from "@/services/userService1";

type Student = {
  _id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  dob?: string;
  phone?: string;
  status: "active" | "inactive";
  note?: string;
  created_at: string;
};

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [classes, setClasses] = useState<StudentCourseItem[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await userApi.getUserById(id, "student");
        setStudent(res.data.data as Student);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchClasses = async () => {
      try {
        const res = await userApi.getStudentCourses(id);
        const data = res.data.data as StudentCourseResponse;
        setClasses(data.courses);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDetail();
    fetchClasses();
  }, [id]);

  if (!student) return <p>Đang tải thông tin học viên...</p>;

  return (
    <div className={styles.detail}>
      <img
        src={student.avatar_url || avatar}
        alt={student.username}
        className={styles.avatar}
      />

      <h2>{student.full_name || student.username}</h2>

      {/* Thông tin sinh viên */}
      <ul>
        <li>
          <strong>Email:</strong> {student.email}
        </li>
        <li>
          <strong>Ngày sinh:</strong>{" "}
          {student.dob
            ? new Date(student.dob).toLocaleDateString("vi-VN")
            : "-"}
        </li>
        <li>
          <strong>Số điện thoại:</strong> {student.phone || "-"}
        </li>
        <li>
          <strong>Trạng thái:</strong>{" "}
          <span className={`status ${student.status}`}>{student.status}</span>
        </li>
        <li>
          <strong>Ngày tạo:</strong>{" "}
          {new Date(student.created_at).toLocaleDateString("vi-VN")}
        </li>
        <li>
          <strong>Ghi chú:</strong> {student.note || "-"}
        </li>
      </ul>

      <hr />

      {/* Danh sách lớp đã đăng ký */}
      <h3>Các lớp đã đăng ký</h3>

      {classes.length === 0 ? (
        <p>Học viên chưa tham gia lớp nào.</p>
      ) : (
        <ul className={styles.classList}>
          {classes.map((item) => (
            <li key={item.enrollment_id} className={styles.classItem}>
              <strong>{item.class_name}</strong> — {item.class_status}
              <br />
              <small>
                Khóa học: {item.course.code} - {item.course.name}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
