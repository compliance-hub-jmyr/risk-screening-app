import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TOKEN_PROVIDER } from '../tokens';

/**
 * JWT Token Injection Interceptor
 *
 * Reads the JWT via TOKEN_PROVIDER — an InjectionToken defined in core.
 * The concrete implementation (AuthService) is wired in app.config.ts,
 * so core never imports from features (no circular dependency).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenProvider = inject(TOKEN_PROVIDER);
  const token = tokenProvider.getToken();

  if (!token || req.url.includes('/authentication/sign-in')) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
