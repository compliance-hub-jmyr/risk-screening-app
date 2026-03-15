/**
 * Environment Configuration Types
 *
 * Defines the structure of environment configuration objects.
 */

export interface Environment {
  production: boolean;
  apiUrl: string;
  enableDebugTools: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}
