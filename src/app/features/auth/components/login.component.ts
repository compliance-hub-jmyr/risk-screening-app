import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../services';
import { ToastService } from '@/app/core/services';
import { ErrorResponse, ERROR_CODES } from '@/app/shared/models/api';

interface BrandingFeature {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly currentYear = new Date().getFullYear();

  protected readonly brandingFeatures: BrandingFeature[] = [
    { icon: 'pi pi-shield', label: 'OFAC, World Bank & ICIJ watchlist checks' },
    { icon: 'pi pi-bolt', label: 'Real-time screening results in seconds' },
    { icon: 'pi pi-history', label: 'Full screening history per supplier' },
    { icon: 'pi pi-lock', label: 'Secure, audit-ready compliance records' },
  ];

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
        this.toast.success('Welcome back!', 'Sign in successful');
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

    switch (apiError?.errorNumber) {
      case ERROR_CODES.INVALID_CREDENTIALS:
        this.errorMessage.set('Invalid email or password. Please try again.');
        break;
      case ERROR_CODES.ACCOUNT_LOCKED:
        this.errorMessage.set(
          'Your account is locked due to too many failed attempts. Please contact support.',
        );
        break;
      default:
        this.errorMessage.set('An unexpected error occurred. Please try again later.');
    }
  }

  // ─── Field helpers ──────────────────────────────────────────────

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
    if (ctrl.hasError('required')) return 'Email is required.';
    if (ctrl.hasError('email')) return 'Invalid email format.';
    return '';
  }

  protected get passwordError(): string {
    const ctrl = this.form.controls.password;
    if (ctrl.hasError('required')) return 'Password is required.';
    return '';
  }
}
