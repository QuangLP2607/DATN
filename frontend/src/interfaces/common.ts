export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: string;
  time: string;
}

export interface ApiError<T> {
  code: number;
  success: false;
  message: string;
  data?: T;
  time: string;
}
