import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { API_ENDPOINTS } from '@/app/core/config';
import { TokenProvider } from '@/app/core/tokens';
import { AuthenticatedUserResponse, SignInRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService implements TokenProvider {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private readonly _currentUser = signal<AuthenticatedUserResponse | null>(this.getStoredUser());
  private readonly _token = signal<string | null>(this.getStoredToken());

  /** Readonly signal — current authenticated user */
  readonly currentUser = this._currentUser.asReadonly();

  /** True when a valid token exists in memory */
  readonly isAuthenticated = computed(() => this._token() !== null);

  /** Resolves the current JWT token (used by authInterceptor) */
  getToken(): string | null {
    return this._token();
  }

  signIn(request: SignInRequest): Observable<AuthenticatedUserResponse> {
    return this.http
      .post<AuthenticatedUserResponse>(API_ENDPOINTS.SIGN_IN, request)
      .pipe(tap((response) => this.persistSession(response)));
  }

  /**
   * Verifies the stored token is still valid by calling GET /authentication/me.
   * - On success: refreshes the stored user profile and returns true.
   * - On failure (401 / network error): clears the session and returns false.
   *
   * Used by authGuard to prevent access with an expired/revoked token.
   */
  verifySession(): Observable<boolean> {
    if (!this._token()) {
      return of(false);
    }

    return this.http.get<AuthenticatedUserResponse>(API_ENDPOINTS.GET_CURRENT_USER).pipe(
      tap((user) => this.persistSession(user)),
      map(() => true),
      catchError(() => {
        this.clearSession();
        return of(false);
      }),
    );
  }

  /**
   * Fetches the current user profile from the backend.
   * Refreshes the in-memory user signal.
   */
  getCurrentUser(): Observable<AuthenticatedUserResponse> {
    return this.http
      .get<AuthenticatedUserResponse>(API_ENDPOINTS.GET_CURRENT_USER)
      .pipe(tap((user) => this._currentUser.set(user)));
  }

  signOut(): void {
    this.clearSession();
    this.router.navigate(['/login']).then();
  }

  private persistSession(user: AuthenticatedUserResponse): void {
    localStorage.setItem(this.TOKEN_KEY, user.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this._token.set(user.token);
    this._currentUser.set(user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._token.set(null);
    this._currentUser.set(null);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): AuthenticatedUserResponse | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? (JSON.parse(raw) as AuthenticatedUserResponse) : null;
    } catch {
      return null;
    }
  }
}
