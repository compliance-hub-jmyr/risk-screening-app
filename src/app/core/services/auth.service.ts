import { Injectable, signal } from '@angular/core';

/**
 * Authentication Service
 *
 * Manages user authentication state and JWT token storage.
 * This is a minimal version - will be fully implemented in feature/us-iam-002
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());

  /**
   * Gets the current JWT token from memory
   */
  getToken(): string | null {
    return this.tokenSignal();
  }

  /**
   * Stores JWT token in localStorage and updates signal
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  /**
   * Removes JWT token from localStorage and clears signal
   */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.tokenSignal.set(null);
  }

  /**
   * Checks if a user is authenticated
   */
  isAuthenticated(): boolean {
    return this.tokenSignal() !== null;
  }

  /**
   * Retrieves token from localStorage on service initialization
   */
  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
