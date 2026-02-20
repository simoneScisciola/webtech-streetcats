export interface Pagination {
  currentPage: number;
  nextPage: number | null;
  size: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedResponse<T> extends Pagination {
  data: T[];
}