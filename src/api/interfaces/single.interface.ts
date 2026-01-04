import type { ApiResponseBase } from './base.interface';

export interface SingleResponse<T> extends ApiResponseBase {
  success: true;
  data: T;
}
