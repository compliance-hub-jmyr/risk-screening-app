import { InjectionToken } from '@angular/core';

/**
 * Contract that any token provider must satisfy.
 * Defined in the core to avoid circular dependencies.
 */
export interface TokenProvider {
  getToken(): string | null;
}

/**
 * InjectionToken used by authInterceptor to retrieve the JWT.
 * Registered in app.config.ts pointing to the feature AuthService.
 */
export const TOKEN_PROVIDER = new InjectionToken<TokenProvider>('TOKEN_PROVIDER');
