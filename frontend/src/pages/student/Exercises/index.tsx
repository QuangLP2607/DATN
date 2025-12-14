import classNames from "classnames/bind";
import styles from "./Exercises.module.scss";

const cx = classNames.bind(styles);

const Exercises = () => {
  return <div className={cx("exercises")}>Exercises</div>;
};

export default Exercises;
