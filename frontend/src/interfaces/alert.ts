export type AlertType = "success" | "error" | "warning";

export interface AlertData {
  title?: string;
  content: string;
  type: AlertType;
}

export interface AlertProps {
  alert: AlertData;
  clearAlert: () => void;
}
