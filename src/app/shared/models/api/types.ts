/**
 * Shared API Types
 * Common interfaces that mirror the backend C# response models
 */

/**
 * Generic pagination metadata returned by all paginated endpoints
 */
export interface PageMetadata {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Generic paginated response from API
 */
export interface PageResponse<T> {
  content: T[];
  meta: PageMetadata;
}

/**
 * Field-level validation error details
 */
export interface FieldError {
  field: string;
  message: string;
  rejectedValue?: unknown;
}

/**
 * Standard RFC 7807 Error Response structure extended with business error codes
 */
export interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  instance?: string;
  errorNumber: number;
  errorCode: string;
  message: string;
  timestamp: string;
  fieldErrors?: FieldError[];
}
