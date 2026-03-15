import { Environment } from './environment.types';

export const environment: Environment = {
  production: true,
  apiUrl: `${window.location.origin}/api`,
  enableDebugTools: false,
  logLevel: 'error',
};
