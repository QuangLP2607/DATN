import type { ReactNode } from "react";
import classNames from "classnames/bind";
import AdminFooter from "./Footer";
import AdminHeader from "./Header";
import AdminSidebar from "./Sidebar";
import styles from "./AdminLayout.module.scss";

const cx = classNames.bind(styles);

interface AdminLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
}

const AdminLayout = ({
  children,
  showHeader = true,
  showSidebar = true,
  showFooter = true,
}: AdminLayoutProps) => {
  return (
    <div className={cx("wrapper")}>
      {showSidebar && <AdminSidebar />}

      <div className={cx("wrapper__content")}>
        {showHeader && <AdminHeader />}

        {/* Main layout container */}
        <div className={cx("main-container")}>
          <main className={cx("main")}>{children}</main>
        </div>

        {showFooter && <AdminFooter />}
      </div>
    </div>
  );
};

export default AdminLayout;
