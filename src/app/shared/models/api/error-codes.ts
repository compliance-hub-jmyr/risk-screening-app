/**
 * Backend error codes mapped from ErrorCodes.cs
 *
 * Error codes follow a structured numbering scheme:
 * - 1000-1999: Validation & Value Object errors
 * - 2000-2999: Authentication errors
 * - 3000-3999: Authorization errors
 * - 4000-4999: Entity not found errors
 * - 5000-5999: Business rule violations
 * - 6000-6999: Infrastructure errors
 */
export const ERROR_CODES = {
  // Validation Errors
  VALIDATION_FAILED: 1000,
  INVALID_VALUE: 1001,

  // Authentication & Authorization (2000-3999)
  AUTHENTICATION_FAILED: 2000,
  INVALID_CREDENTIALS: 2001,
  ACCOUNT_LOCKED: 2002,
  AUTHORIZATION_FAILED: 3000,

  // Not Found Errors (4000-4999)
  ENTITY_NOT_FOUND: 4000,
  USER_NOT_FOUND: 4001,
  ROLE_NOT_FOUND: 4002,
  SUPPLIER_NOT_FOUND: 4003,
  SCREENING_NOT_FOUND: 4004,

  // Business Rule Violations (5000-5999)
  BUSINESS_RULE_VIOLATION: 5000,
  EMAIL_ALREADY_EXISTS: 5001,
  ROLE_ALREADY_EXISTS: 5002,
  SUPPLIER_TAXID_ALREADY_EXISTS: 5003,
  SUPPLIER_ALREADY_DELETED: 5004,
  INVALID_SUPPLIER_STATE: 5005,

  // Infrastructure Errors
  INFRASTRUCTURE_ERROR: 6000,
  REQUIRED_SEED_DATA_MISSING: 6001,
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
export type ErrorCodeName = keyof typeof ERROR_CODES;
