import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import {
  apiVersionInterceptor,
  authInterceptor,
  errorHandlerInterceptor,
  TOKEN_PROVIDER,
} from '@/app/core';
import { AuthService } from './features/auth/services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiVersionInterceptor, authInterceptor, errorHandlerInterceptor]),
    ),
    providePrimeNG({
      theme: { preset: Aura },
    }),
    // Wire TOKEN_PROVIDER → AuthService
    { provide: TOKEN_PROVIDER, useExisting: AuthService },
  ],
};
