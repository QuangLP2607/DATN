import classNames from "classnames/bind";
import LeftSlide from "./Components/LeftSlide";
import RightForm from "./Components/RightForm";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

const Login = () => {
  return (
    <div className={cx("login")}>
      <div className={cx("login-form")}>
        <div className={cx("left-slide")}>
          <LeftSlide />
        </div>
        <RightForm />
      </div>
    </div>
  );
};

export default Login;
