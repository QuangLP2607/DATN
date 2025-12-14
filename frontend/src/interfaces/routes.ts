import type { ComponentType,ReactElement, ReactNode } from "react";

/**
 * Các props dùng cho layout (header, sidebar, footer, v.v.)
 */
export interface LayoutProps {
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
  [key: string]: unknown;
}

/**
 * Kiểu dữ liệu đại diện cho từng route
 */
export interface RouteType {
  path: string;
  component: () => ReactElement;
  layout?: ComponentType<{ children: ReactNode }> | null;
  layoutProps?: LayoutProps;
  role?: "student" | "teacher" | "admin";
}
