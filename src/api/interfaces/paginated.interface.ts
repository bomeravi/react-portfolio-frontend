import type { ApiResponseBase } from './base.interface';

export interface PaginatedResponse<T> extends ApiResponseBase {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}
