import type { ReactNode } from "react";
import classNames from "classnames/bind";
import StudentFooter from "./Footer";
import StudentHeader from "./Header";
import StudentSidebar from "./Sidebar";
import styles from "./StudentLayout.module.scss";

const cx = classNames.bind(styles);

interface StudentLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
}

const StudentLayout = ({
  children,
  showHeader = true,
  showSidebar = true,
  showFooter = true,
}: StudentLayoutProps) => {
  return (
    <div className={cx("wrapper")}>
      {showSidebar && <StudentSidebar />}
      <div className={cx("wrapper__content")}>
        {showHeader && <StudentHeader />}
        <main className={cx("wrapper__content--main")}>{children}</main>
        {showFooter && <StudentFooter />}
      </div>
    </div>
  );
};

export default StudentLayout;

