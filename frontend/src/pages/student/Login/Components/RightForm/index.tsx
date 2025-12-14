import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import classNames from "classnames/bind";
import styles from "./RightForm.module.scss";

import logoIcon from "@assets/logo/logo-icon.png";
import logoText from "@assets/logo/logo-text.png";
import Alert from "@components/Alert";
import { useAuth } from "@hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { AlertData } from "@interfaces/alert";
import type { LoginPayload } from "@interfaces/auth";
import authApi from "@services/authService";

const cx = classNames.bind(styles);

const RightForm = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();
  const [alert, setAlert] = useState<AlertData | null>(null);
  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
    role: "student",
  });

  const clearAlert = () => setAlert(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.login(formData);
      const { accessToken } = res.data.data;
      console.log(res.data);

      // 🔹 Gọi context login (tự động fetch profile)
      await contextLogin(accessToken, formData.role);

      setAlert({
        title: "Thành công",
        content: "Đăng nhập thành công",
        type: "success",
      });

      // Wait a bit then navigate
      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (error: unknown) {
      let content = "Đăng nhập thất bại";

      if (error instanceof AxiosError) {
        content = error.response?.data?.message || content;
      } else if (error instanceof Error) {
        content = error.message;
      }

      setAlert({ title: "Đăng nhập thất bại", content, type: "error" });
    }
  };

  return (
    <div className={cx("right")}>
      {alert && <Alert alert={alert} clearAlert={clearAlert} />}

      <form className={cx("form")} onSubmit={handleSubmit}>
        <div className={cx("form__logo")}>
          <img
            src={logoIcon}
            alt="logo icon"
            className={cx("form__logo-icon")}
          />
          <img
            src={logoText}
            alt="logo text"
            className={cx("form__logo-text")}
          />
        </div>
        <h2 className={cx("form__title")}>Chào mừng đến với JPedu</h2>

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={cx("form__input")}
          placeholder="Email"
          type="email"
          required
        />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={cx("form__input")}
          placeholder="Password"
          type="password"
          required
        />

        <div className={cx("form__forgot")}>Quên mật khẩu?</div>

        <button className={cx("form__btn")} type="submit">
          Đăng nhập
        </button>

        <div className={cx("form__or")}>or</div>
        <div className={cx("form__google")}>
          <Icon icon="devicon:google" />
          Sign in with Google
        </div>
      </form>
    </div>
  );
};

export default RightForm;
