export interface Class {
  _id: string;
  name: string;
  course_id: {
    _id: string;
    code: string;
    name: string;
  };
  teacher_ids: { _id: string; full_name: string; email: string }[];
  start_date: string;
  end_date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
