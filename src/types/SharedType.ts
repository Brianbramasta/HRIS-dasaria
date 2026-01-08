export interface FileSummary {
  fileName: string;
  fileUrl: string;
  fileType: string;
  size: string | number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TableFilter {
  search: string;
  filter?: string | string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | null;
  page: number;
  pageSize: number;
}

export interface ApiPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface ApiPaginatedResponse<T> extends ApiPagination {
  data: T[];
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
}
