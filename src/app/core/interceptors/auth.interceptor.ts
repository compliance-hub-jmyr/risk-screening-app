import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@/app/core';

/**
 * JWT Token Injection Interceptor
 *
 * Automatically injects the JWT Bearer token from AuthService
 * into all outgoing HTTP requests to authenticated endpoints.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Skip token injection for public endpoints
  if (!token || req.url.includes('/authentication/sign-in')) {
    return next(req);
  }

  // Clone request and add Authorization header
  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(cloned);
};
