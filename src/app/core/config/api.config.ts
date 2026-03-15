import { environment } from '@/environments/environment';

/**
 * API Configuration
 *
 * Centralized configuration for API endpoints and settings.
 */

/**
 * Base URL for the backend API
 * Loaded from environment configuration
 */
export const API_BASE_URL = environment.apiUrl;

/**
 * API Version header value
 */
export const API_VERSION = '1.0';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  SIGN_IN: `${API_BASE_URL}/authentication/sign-in`,
  GET_CURRENT_USER: `${API_BASE_URL}/authentication/me`,

  // Suppliers
  SUPPLIERS: `${API_BASE_URL}/suppliers`,
  SUPPLIER_BY_ID: (id: string) => `${API_BASE_URL}/suppliers/${id}`,
} as const;
