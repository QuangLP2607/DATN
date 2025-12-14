import { useEffect,useState } from "react";
import classNames from "classnames/bind";
import LeftSlide from "./Components/LeftSlide";
import RightForm from "./Components/RightForm";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

const Login = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={cx("login")}>
      <div className={cx("container")}>
        {!isMobile && <LeftSlide />}
        <RightForm />
      </div>
    </div>
  );
};

export default Login;
