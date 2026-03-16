import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

const LANG_STORAGE_KEY = 'app_language';
const SUPPORTED_LANGS = ['en', 'es'] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);

  constructor() {
    this.transloco.setActiveLang(this.resolveInitialLang());
  }

  /** 1. localStorage → 2. browser language → 3. fallback 'en' */
  private resolveInitialLang(): SupportedLang {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && (SUPPORTED_LANGS as readonly string[]).includes(stored)) {
      return stored as SupportedLang;
    }
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    if ((SUPPORTED_LANGS as readonly string[]).includes(browserLang)) {
      return browserLang as SupportedLang;
    }
    return 'en';
  }

  setLanguage(lang: SupportedLang): void {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    this.transloco.setActiveLang(lang);
  }

  getCurrentLanguage(): string {
    return this.transloco.getActiveLang();
  }

  toggleLanguage(): void {
    const next = this.getCurrentLanguage() === 'en' ? 'es' : 'en';
    this.setLanguage(next);
  }
}
