import { ApplicationConfig, inject, Injectable, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';

import { routes } from './app.routes';
import {
  apiVersionInterceptor,
  authInterceptor,
  errorHandlerInterceptor,
  TOKEN_PROVIDER,
} from '@/app/core';
import { AuthService } from './features/auth/services';

@Injectable({ providedIn: 'root' })
class AppTranslocoLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(langPath: string) {
    const parts = langPath.split('/');
    const url =
      parts.length === 2
        ? `/assets/i18n/${parts[1]}/${parts[0]}.json`
        : `/assets/i18n/${langPath}.json`;
    return this.http.get<Record<string, unknown>>(url);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([apiVersionInterceptor, authInterceptor, errorHandlerInterceptor]),
    ),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: 'none' },
      },
    }),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es'],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: false,
      },
      loader: AppTranslocoLoader,
    }),
    { provide: TOKEN_PROVIDER, useExisting: AuthService },
  ],
};
