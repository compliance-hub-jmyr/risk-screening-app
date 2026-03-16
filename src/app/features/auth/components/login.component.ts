import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { TranslocoModule, TranslocoService, TRANSLOCO_SCOPE } from '@jsverse/transloco';

import { AuthService } from '../services';
import { ToastService } from '@/app/core/services';
import { SimpleLanguageService } from '@/app/app.config';
import { ErrorResponse, ERROR_CODES } from '@/app/shared/models/api';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, TranslocoModule],
  templateUrl: './login.component.html',
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'auth' }],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly transloco = inject(TranslocoService);
  protected readonly languageService = inject(SimpleLanguageService);

  protected readonly currentYear = new Date().getFullYear();

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService.signIn({ email: email!, password: password! }).subscribe({
      next: () => {
        this.toast.success(
          this.transloco.translate('auth.toast.success_title'),
          this.transloco.translate('auth.toast.success_detail'),
        );
        this.router.navigate(['/suppliers']).then();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.handleError(err);
      },
    });
  }

  private handleError(err: HttpErrorResponse): void {
    const apiError = err.error as ErrorResponse | undefined;

    switch (apiError?.errorCode) {
      case ERROR_CODES.INVALID_CREDENTIALS:
        this.errorMessage.set(this.transloco.translate('auth.errors.invalid_credentials'));
        break;
      case ERROR_CODES.ACCOUNT_LOCKED:
        this.errorMessage.set(this.transloco.translate('auth.errors.account_locked'));
        break;
      default:
        this.errorMessage.set(this.transloco.translate('auth.errors.unexpected'));
    }
  }

  protected get emailInvalid(): boolean {
    const ctrl = this.form.controls.email;
    return ctrl.invalid && ctrl.touched;
  }

  protected get passwordInvalid(): boolean {
    const ctrl = this.form.controls.password;
    return ctrl.invalid && ctrl.touched;
  }

  protected get emailError(): string {
    const ctrl = this.form.controls.email;
    if (ctrl.hasError('required'))
      return this.transloco.translate('auth.form.email.errors.required');
    if (ctrl.hasError('email')) return this.transloco.translate('auth.form.email.errors.email');
    return '';
  }

  protected get passwordError(): string {
    const ctrl = this.form.controls.password;
    if (ctrl.hasError('required'))
      return this.transloco.translate('auth.form.password.errors.required');
    return '';
  }

  protected onToggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  protected getCurrentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }
}
