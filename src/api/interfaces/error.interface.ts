import type { ApiResponseBase } from "./base.interface";

// interface FieldErrors {
//   [field: string]: unknown;
// }

export interface ApiError extends ApiResponseBase {
  success: false;
//   errors?: Record<string, unknown>;
//   errors?: FieldErrors;
  errors?: Record<string, unknown>; 
}
