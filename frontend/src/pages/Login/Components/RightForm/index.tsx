import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./RightForm.module.scss";
import logoIcon from "@/assets/logo/logo-icon.png";
import logoText from "@/assets/logo/logo-text.png";
import { useAuth } from "@/hooks/useAuth";
import type { LoginPayload } from "@/interfaces/auth";
import authApi from "@/services/authService";
import { Icon } from "@iconify/react/dist/iconify.js";

const cx = classNames.bind(styles);

const RightForm = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();

  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrorMessage("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await authApi.login(formData);
      await contextLogin(res.accessToken, res.role);
      navigate("/home");
    } catch {
      setErrorMessage("Tài khoản hoặc mật khẩu không đúng.");
    }
  };

  return (
    <div className={cx("right")}>
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
          autoComplete="email"
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
        <div className={cx("form__forgot")}>Quên mật khẩu?</div>

        {errorMessage && <p className={cx("form__error")}>{errorMessage}</p>}

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
