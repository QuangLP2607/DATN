import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ClassList.module.scss";
import type { Class } from "@/interfaces/class";
import { useClass } from "@/hooks/useClass";

const cx = classNames.bind(styles);

interface ClassListProps {
  classes: (Class & { student_count: number })[];
}

export default function ClassList({ classes }: ClassListProps) {
  const { setActiveClass } = useClass();
  const navigate = useNavigate();

  const handleGoToClass = (cls: Class) => {
    setActiveClass(cls);
    localStorage.setItem("activeClassId", cls.id);
    navigate("/teaching/class");
  };

  return (
    <section className={cx("card")}>
      <div className={cx("card__header")}>
        <h2>Các lớp của bạn</h2>
      </div>

      <div className={cx("class-list")}>
        {classes.map((cls) => (
          <div key={cls.id} className={cx("class-item")}>
            <div className={cx("class-info")}>
              <div className={cx("title-row")}>
                <h4>{cls.name}</h4>
                <span className={cx("student-count")}>
                  {cls.student_count ?? 0} học sinh
                </span>
              </div>

              <span className={cx("dates")}>
                {new Date(cls.start_date).toLocaleDateString()} →{" "}
                {new Date(cls.end_date).toLocaleDateString()}
              </span>

              <div className={cx("progress-wrapper")}>
                <div className={cx("progress-bar")}>
                  <div
                    className={cx("progress-bar__fill")}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          ((Date.now() - new Date(cls.start_date).getTime()) /
                            (new Date(cls.end_date).getTime() -
                              new Date(cls.start_date).getTime())) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
                <span className={cx("progress-text")}>
                  {Math.round(
                    Math.min(
                      100,
                      Math.max(
                        0,
                        ((Date.now() - new Date(cls.start_date).getTime()) /
                          (new Date(cls.end_date).getTime() -
                            new Date(cls.start_date).getTime())) *
                          100
                      )
                    )
                  )}
                  %
                </span>
              </div>

              <button
                className={cx("btn", "ghost")}
                onClick={() => handleGoToClass(cls)}
              >
                Đi đến lớp
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
