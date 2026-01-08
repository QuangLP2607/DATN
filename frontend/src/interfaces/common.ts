export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: string;
  time: string;
}

// ===== Pagination ================================================================
export type OrderType = "asc" | "desc";

export const SORT_OPTIONS: { label: string; value: OrderType }[] = [
  { label: "Newest first", value: "desc" },
  { label: "Oldest first", value: "asc" },
];

export interface ListParams {
  search: string;
  sortBy: string;
  order: OrderType;
  page: number;
  limit: number;
}

export type PaginatedResponse<K extends string, T> = {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} & Record<K, T[]>;
