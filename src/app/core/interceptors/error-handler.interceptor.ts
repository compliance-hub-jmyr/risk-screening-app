import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { ToastService } from '@/app/core';
import { ERROR_CODES, ErrorResponse } from '../../shared/models/api';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const transloco = inject(TranslocoService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Skip toast for login — LoginComponent handles those errors inline
      if (req.url.includes('/authentication/sign-in')) {
        return throwError(() => error);
      }

      let message = transloco.translate('errors.unexpected');
      let errorCode: string | undefined;

      if (error.error && typeof error.error === 'object') {
        const apiError = error.error as ErrorResponse;
        message = apiError.message || apiError.title || message;
        errorCode = apiError.errorCode;

        if (errorCode === ERROR_CODES.AUTHENTICATION_FAILED) {
          message = transloco.translate('errors.sessionExpired');
        } else if (errorCode === ERROR_CODES.AUTHORIZATION_FAILED) {
          message = transloco.translate('errors.noPermission');
        } else if (errorCode === ERROR_CODES.RATE_LIMIT_EXCEEDED || error.status === 429) {
          message = transloco.translate('errors.rateLimitExceeded');
        } else if (error.status >= 500) {
          message = transloco.translate('errors.serverError');
        }
      } else {
        if (error.status === 0) {
          message = transloco.translate('errors.noConnection');
        }
      }

      toastService.error(message);

      return throwError(() => error);
    }),
  );
};
