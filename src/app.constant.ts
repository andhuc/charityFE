export const API_URL = 'http://localhost:5001';

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PagedResult<T> {
  queryable: T[];
  rowCount: number;
  currentPage: number;
  pageSize: number;
}