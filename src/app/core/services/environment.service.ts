import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { Environment } from '@/environments/environment.types';

/**
 * Environment Configuration Service
 *
 * Provides type-safe access to environment configuration.
 * Useful for conditional logic based on environment settings.
 */
@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private readonly config: Environment = environment;

  /**
   * Check if running in production mode
   */
  get isProduction(): boolean {
    return this.config.production;
  }

  /**
   * Check if running in development mode
   */
  get isDevelopment(): boolean {
    return !this.config.production;
  }

  /**
   * Get the API base URL
   */
  get apiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Check if debug tools are enabled
   */
  get debugToolsEnabled(): boolean {
    return this.config.enableDebugTools;
  }

  /**
   * Get the current log level
   */
  get logLevel(): Environment['logLevel'] {
    return this.config.logLevel;
  }

  /**
   * Get the full environment configuration
   */
  get environment(): Readonly<Environment> {
    return this.config;
  }
}
