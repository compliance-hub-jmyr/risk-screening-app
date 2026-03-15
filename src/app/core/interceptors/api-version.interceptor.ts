import { HttpInterceptorFn } from '@angular/common/http';

/**
 * API Version Header Interceptor
 *
 * Injects the X-Api-Version header to all API requests
 * to ensure version compatibility with the backend.
 */
export const apiVersionInterceptor: HttpInterceptorFn = (req, next) => {
  // Only apply to API endpoints
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      'X-Api-Version': '1.0',
    },
  });

  return next(cloned);
};
