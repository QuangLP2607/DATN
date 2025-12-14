export interface Course {
  _id: string;
  code: string;
  name: string;
  description?: string;
  total_lessons: number;
  is_active: boolean;
  total_classes: number;
  active_classes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoursePayload {
  code: string;
  name: string;
  description?: string;
  total_lessons?: number;
  is_active?: boolean;
}

export interface UpdateCoursePayload {
  code?: string;
  name?: string;
  description?: string;
  total_lessons?: number;
  is_active?: boolean;
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
