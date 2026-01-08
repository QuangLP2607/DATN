import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./Class.module.scss";
import type { Schedule } from "@/interfaces/schedule";
import { useClass } from "@/hooks/useClass";
import scheduleApi from "@/services/scheduleService";
import enrollmentApi from "@/services/enrollmentService";
import Loading from "@/components/ui/Loading";
import Alert from "@/components/commons/Alert";

const cx = classNames.bind(styles);

const Class = () => {
  const { activeClass } = useClass();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const progress = activeClass
    ? Math.min(
        Math.max(
          ((Date.now() - new Date(activeClass.start_date).getTime()) /
            (new Date(activeClass.end_date).getTime() -
              new Date(activeClass.start_date).getTime())) *
            100,
          0
        ),
        100
      )
    : 0;

  // Load schedules + students
  useEffect(() => {
    if (!activeClass?.id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // const scheduleRes = await scheduleApi.search({
        //   class_id: activeClass.id,
        // });
        // setSchedules(scheduleRes);
        // const studentRes = await enrollmentApi.search({
        //   class_id: activeClass.id,
        // });
        // setStudents(studentRes);
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải dữ liệu lớp.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeClass?.id]);

  const handleStartClass = () => {
    if (!activeClass) return;
    navigate(`/teaching/class/live`);
  };

  if (!activeClass) return <div>Không có lớp được chọn.</div>;
  if (loading) return <Loading />;

  return (
    <div className={cx("class-detail")}>
      {error && <Alert type="error" message={error} />}

      <header className={cx("header")}>
        <h1>{activeClass.name}</h1>
        <div className={cx("progress-wrapper")}>
          <div className={cx("progress-bar")}>
            <div
              className={cx("progress-bar__fill")}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
      </header>

      <main className={cx("main")}>
        <p>Số học sinh: {students.length}</p>
        <p>Tổng buổi học: {schedules.length}</p>

        <button className={cx("start-class-button")} onClick={handleStartClass}>
          Bắt đầu buổi học
        </button>
      </main>
    </div>
  );
};

export default Class;
