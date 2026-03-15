import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '@/app/core';
import { ERROR_CODES, ErrorResponse } from '@/app/shared/models/api';

/**
 * Global HTTP Error Handler Interceptor
 *
 * Catches all HTTP errors and provides centralized error handling:
 * - Parses RFC 7807 error responses from backend
 * - Displays user-friendly toast notifications
 * - Handles authentication errors (401)
 * - Logs errors for debugging
 */
export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';
      let errorCode: number | undefined;

      // Parse RFC 7807 ErrorResponse from backend
      if (error.error && typeof error.error === 'object') {
        const apiError = error.error as ErrorResponse;
        errorMessage = apiError.message || apiError.title || errorMessage;
        errorCode = apiError.errorNumber;

        // Handle specific error codes
        if (errorCode === ERROR_CODES.AUTHENTICATION_FAILED) {
          errorMessage = 'Your session has expired. Please log in again.';
          // TODO: Redirect to login page when AuthService is implemented
        } else if (errorCode === ERROR_CODES.AUTHORIZATION_FAILED) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (error.status >= 500) {
          errorMessage = 'A server error occurred. Please try again later.';
        }
      } else {
        // Handle network errors or non-API errors
        if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error.status === 404) {
          errorMessage = 'The requested resource was not found.';
        }
      }

      // Display toast notification
      toastService.error(errorMessage);

      // Log error for debugging
      console.error('[HTTP Error]', {
        url: req.url,
        method: req.method,
        status: error.status,
        errorCode,
        message: errorMessage,
        details: error.error,
      });

      // Re-throw error for component-level handling if needed
      return throwError(() => error);
    }),
  );
};
