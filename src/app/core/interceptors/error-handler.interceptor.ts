import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '@/app/core';
import { ERROR_CODES, ErrorResponse } from '../../shared/models/api';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Skip toast for login — LoginComponent handles those errors inline
      if (req.url.includes('/authentication/sign-in')) {
        return throwError(() => error);
      }

      let message = 'An unexpected error occurred';
      let errorCode: number | undefined;

      if (error.error && typeof error.error === 'object') {
        const apiError = error.error as ErrorResponse;
        message = apiError.message || apiError.title || message;
        errorCode = apiError.errorNumber;

        if (errorCode === ERROR_CODES.AUTHENTICATION_FAILED) {
          message = 'Your session has expired. Please log in again.';
        } else if (errorCode === ERROR_CODES.AUTHORIZATION_FAILED) {
          message = 'You do not have permission to perform this action.';
        } else if (error.status >= 500) {
          message = 'A server error occurred. Please try again later.';
        }
      } else {
        if (error.status === 0) {
          message = 'Unable to connect to the server. Please check your internet connection.';
        }
      }

      toastService.error(message);

      return throwError(() => error);
    }),
  );
};
