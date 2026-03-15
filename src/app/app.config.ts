import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { apiVersionInterceptor, authInterceptor, errorHandlerInterceptor } from '@/app/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiVersionInterceptor, authInterceptor, errorHandlerInterceptor]),
    ),
    providePrimeNG({
      theme: { preset: Aura },
    }),
  ],
};
