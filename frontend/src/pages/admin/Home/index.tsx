import classNames from "classnames/bind";
import styles from "./Home.module.scss";

// import CoursesByStudentsChart from "@/components/stats/CoursesByStudentsChart";
// import StudentsByMonthChart from "@/components/stats/StudentsByMonthChart";

const cx = classNames.bind(styles);

const Home = () => {
  return (
    <div className={cx("home")}>
      {/* <StudentsByMonthChart />
      <CoursesByStudentsChart /> */}
    </div>
  );
};

export default Home;
