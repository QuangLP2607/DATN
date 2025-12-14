import type { ReactNode } from "react";
import classNames from "classnames/bind";
import TeacherFooter from "./Footer";
import TeacherHeader from "./Header";
import TeacherSidebar from "./Sidebar";
import styles from "./TeacherLayout.module.scss";

const cx = classNames.bind(styles);

interface TeacherLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
}

const TeacherLayout = ({
  children,
  showHeader = true,
  showSidebar = true,
  showFooter = true,
}: TeacherLayoutProps) => {
  return (
    <div className={cx("wrapper")}>
      {showSidebar && <TeacherSidebar />}
      <div className={cx("wrapper__content")}>
        {showHeader && <TeacherHeader />}
        <main className={cx("wrapper__content--main")}>{children}</main>
        {showFooter && <TeacherFooter />}
      </div>
    </div>
  );
};

export default TeacherLayout;
