import type { ApiResponseBase } from "./base.interface";

export interface NonPaginatedListResponse<T> extends ApiResponseBase {
  success: true;
  data: T[];
}
