import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '@/app/features/auth/services';

/**
 * Auth Guard — protects routes that require authentication.
 * Redirects to /login if no valid token is present.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  // Verify the token is still valid against the backend
  return authService
    .verifySession()
    .pipe(map((valid) => (valid ? true : router.createUrlTree(['/login']))));
};

/**
 * Guest Guard — prevents authenticated users from accessing /login.
 * Uses the local signal only (no HTTP call needed for this direction).
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/suppliers']);
};
