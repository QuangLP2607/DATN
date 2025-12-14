import { useState } from "react";
import { AxiosError } from "axios";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";

import logoIcon from "@assets/logo/logo-icon.png";
import logoText from "@assets/logo/logo-text.png";
import Alert from "@components/commons/Alert";
import { useAuth } from "@hooks/useAuth";
import type { AlertData } from "@interfaces/alert";
import type { LoginPayload } from "@interfaces/auth";
import authApi from "@services/authService";

const cx = classNames.bind(styles);

const Login = () => {
  const { login: contextLogin } = useAuth();
  const [alert, setAlert] = useState<AlertData | null>(null);
  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
    role: "admin",
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
      await contextLogin(accessToken, formData.role);
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
    <div className={cx("login")}>
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
        <h2 className={cx("form__title")}>Đăng nhập hệ thống</h2>

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={cx("form__input")}
          placeholder="Email"
          autoComplete="email"
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
          autoComplete="current-password"
          required
        />

        <button className={cx("form__btn")} type="submit">
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
