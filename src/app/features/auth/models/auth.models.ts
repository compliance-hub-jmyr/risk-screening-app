/**
 * Sign-In Request
 * Maps to POST /api/authentication/sign-in
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Authenticated User Response
 * Returned by the backend after a successful sign-in
 */
export interface AuthenticatedUserResponse {
  id: string;
  email: string;
  username: string;
  status: 'Active' | 'Suspended' | 'Locked' | 'Deleted';
  roles: string[];
  token: string;
}
