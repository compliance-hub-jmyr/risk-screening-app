import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';

import { SupplierService } from '../../services';
import { CreateSupplierRequest, SupplierResponse, UpdateSupplierRequest } from '../../models';
import { COUNTRIES, CountryOption } from '@/app/shared/data/countries.data';
import { ERROR_CODES, ErrorResponse } from '@/app/shared/models/api';
import { ToastService } from '@/app/core/services/toast.service';

// Custom validators

function noWhitespaceOnly(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    typeof control.value === 'string' && control.value.trim().length === 0
      ? { whitespace: true }
      : null;
}

/**
 * Exactly 11 numeric digits — mirrors backend TaxId VO: `^\d{11}$`
 */
function taxIdFormat(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v: string = control.value ?? '';
    if (!v) return null; // required handles empty
    return /^\d{11}$/.test(v) ? null : { taxIdFormat: true };
  };
}

/**
 * Phone — mirrors backend PhoneNumber VO: `^\+?[\d\s\-().]{7,20}$`
 * Optional leading +, then digits/spaces/dashes/parens/dots, 7–20 chars.
 */
function phoneFormat(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v: string = (control.value ?? '').trim();
    if (!v) return null;
    return /^\+?[\d\s\-().]{7,20}$/.test(v) ? null : { phoneFormat: true };
  };
}

/**
 * URL — mirrors backend WebsiteUrl VO: absolute URI, scheme http or https only.
 */
function urlFormat(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v: string = (control.value ?? '').trim();
    if (!v) return null;
    try {
      const url = new URL(v);
      return url.protocol === 'http:' || url.protocol === 'https:' ? null : { urlFormat: true };
    } catch {
      return { urlFormat: true };
    }
  };
}

/**
 * Annual billing — mirrors backend AnnualBilling VO:
 * - non-negative
 * - at most 2 decimal places
 */
function annualBillingFormat(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (isNaN(n)) return { annualBillingFormat: true };
    if (n < 0) return { min: { min: 0, actual: n } };
    // Check at most 2 decimal places
    if (Math.round(n * 100) !== n * 100) return { annualBillingDecimals: true };
    return null;
  };
}

// Field → errorCode map (backend → form control name)
// FluentValidation uses PascalCase property names; we map them to camelCase form controls.
const FIELD_MAP: Record<string, string> = {
  LegalName: 'legalName',
  CommercialName: 'commercialName',
  TaxId: 'taxId',
  Country: 'country',
  ContactEmail: 'contactEmail',
  ContactPhone: 'contactPhone',
  Website: 'website',
  Address: 'address',
  AnnualBillingUsd: 'annualBillingUsd',
};

// Component

@Component({
  selector: 'app-supplier-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    MessageModule,
  ],
  templateUrl: './supplier-form.component.html',
})
export class SupplierFormComponent implements OnInit {
  // Inputs / outputs
  readonly mode = input<'create' | 'edit'>('create');
  readonly initialValue = input<SupplierResponse | null>(null);
  readonly saved = output<SupplierResponse>();
  readonly cancelled = output<void>();
  // State
  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly submitLabel = computed(() =>
    this.mode() === 'create' ? 'Create supplier' : 'Save changes',
  );
  // Form
  protected readonly form = new FormGroup({
    // Required
    legalName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, noWhitespaceOnly(), Validators.maxLength(200)],
    }),
    commercialName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, noWhitespaceOnly(), Validators.maxLength(200)],
    }),
    taxId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, taxIdFormat()],
    }),
    country: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    // Optional
    contactEmail: new FormControl<string | null>(null, {
      validators: [Validators.email],
    }),
    contactPhone: new FormControl<string | null>(null, {
      validators: [phoneFormat()],
    }),
    website: new FormControl<string | null>(null, {
      validators: [urlFormat()],
    }),
    address: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(500)],
    }),
    annualBillingUsd: new FormControl<number | null>(null, {
      validators: [annualBillingFormat()],
    }),
    notes: new FormControl<string | null>(null),
  });
  // Options
  protected readonly countryOptions = COUNTRIES.map((c: CountryOption) => ({
    label: `${c.name} (${c.code})`,
    value: c.code,
  }));
  protected readonly LEGAL_NAME_MAX = 200;
  protected readonly COMMERCIAL_NAME_MAX = 200;
  protected readonly ADDRESS_MAX = 500;
  private readonly supplierService = inject(SupplierService);
  private readonly toastService = inject(ToastService);

  // Lifecycle
  ngOnInit(): void {
    const v = this.initialValue();
    if (v) {
      this.form.patchValue({
        legalName: v.legalName,
        commercialName: v.commercialName,
        taxId: v.taxId,
        country: v.country,
        contactEmail: v.contactEmail,
        contactPhone: v.contactPhone,
        website: v.website,
        address: v.address,
        annualBillingUsd: v.annualBillingUsd,
        notes: v.notes,
      });
    }
  }

  // Submit
  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) return;

    this.serverError.set(null);
    this.submitting.set(true);

    const payload = this.buildPayload();

    if (this.mode() === 'edit') {
      const existing = this.initialValue();
      if (!existing) return;

      this.supplierService.update(existing.id, payload).subscribe({
        next: (supplier) => {
          this.submitting.set(false);
          this.toastService.success(
            `${supplier.legalName} has been updated successfully.`,
            'Supplier updated',
          );
          this.saved.emit(supplier);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.handleServerError(err);
        },
      });
    } else {
      this.supplierService.create(payload).subscribe({
        next: (supplier) => {
          this.submitting.set(false);
          this.toastService.success(
            `${supplier.legalName} has been added successfully.`,
            'Supplier created',
          );
          this.saved.emit(supplier);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.handleServerError(err);
        },
      });
    }
  }

  private buildPayload(): CreateSupplierRequest & UpdateSupplierRequest {
    const raw = this.form.getRawValue();
    return {
      LegalName: raw.legalName.trim(),
      CommercialName: raw.commercialName.trim(),
      TaxId: raw.taxId.trim(),
      Country: raw.country,
      ContactPhone: raw.contactPhone?.trim() || null,
      ContactEmail: raw.contactEmail?.trim() || null,
      Website: raw.website?.trim() || null,
      Address: raw.address?.trim() || null,
      AnnualBillingUsd: raw.annualBillingUsd ?? null,
      Notes: raw.notes?.trim() || null,
    };
  }

  protected cancel(): void {
    this.cancelled.emit();
  }

  // Field error helpers
  protected isInvalid(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

  protected errorFor(name: keyof typeof this.form.controls): string {
    const c = this.form.controls[name];
    if (!c.touched) return '';
    if (c.hasError('serverError')) return c.getError('serverError') as string;
    if (c.hasError('required') || c.hasError('whitespace')) return 'This field is required.';

    switch (name) {
      case 'legalName':
      case 'commercialName':
        if (c.hasError('maxlength'))
          return `Must not exceed ${(c.getError('maxlength') as { requiredLength: number }).requiredLength} characters.`;
        break;

      case 'taxId':
        if (c.hasError('taxIdFormat'))
          return 'Must be exactly 11 numeric digits (no spaces or dashes).';
        break;

      case 'contactEmail':
        if (c.hasError('email')) return 'Enter a valid email address (e.g. contact@example.com).';
        break;

      case 'contactPhone':
        if (c.hasError('phoneFormat'))
          return 'Enter a valid phone number. Use digits, spaces, dashes, parentheses or a leading +. Between 7 and 20 characters (e.g. +1 555 000 0000).';
        break;

      case 'website':
        if (c.hasError('urlFormat'))
          return 'Enter a valid URL starting with http:// or https:// (e.g. https://example.com).';
        break;

      case 'annualBillingUsd':
        if (c.hasError('min')) return 'Amount must be 0 or greater.';
        if (c.hasError('annualBillingDecimals'))
          return 'Amount must have at most 2 decimal places.';
        break;

      case 'address':
        if (c.hasError('maxlength'))
          return `Must not exceed ${(c.getError('maxlength') as { requiredLength: number }).requiredLength} characters.`;
        break;
    }

    return '';
  }

  // Character-count helpers (for hint display in template)
  protected charCount(name: 'legalName' | 'commercialName' | 'address'): number {
    const v = this.form.controls[name].value;
    return typeof v === 'string' ? v.length : 0;
  }

  // Server error handling
  private handleServerError(err: HttpErrorResponse): void {
    const body = err.error as ErrorResponse | undefined;
    const code = body?.errorCode;

    // Map per-field errors
    if (code === ERROR_CODES.VALIDATION_FAILED && body?.fieldErrors?.length) {
      for (const fe of body.fieldErrors) {
        const controlName = FIELD_MAP[fe.field] ?? fe.field;
        const control = this.form.get(controlName);
        if (control) {
          control.setErrors({ serverError: fe.message });
          control.markAsTouched();
        }
      }
      this.serverError.set('Please correct the highlighted fields.');
      return;
    }

    // Map specific error codes to targeted field errors or banner messages
    switch (code) {
      case ERROR_CODES.SUPPLIER_TAX_ID_ALREADY_EXISTS:
        this.form.controls.taxId.setErrors({ serverError: 'This Tax ID is already registered.' });
        this.form.controls.taxId.markAsTouched();
        this.serverError.set('A supplier with this Tax ID already exists.');
        break;
      case ERROR_CODES.INVALID_TAX_ID:
        this.form.controls.taxId.setErrors({
          serverError: 'Must be exactly 11 numeric digits.',
        });
        this.form.controls.taxId.markAsTouched();
        break;
      case ERROR_CODES.INVALID_LEGAL_NAME:
        this.form.controls.legalName.setErrors({
          serverError: body?.message ?? 'Invalid legal name.',
        });
        this.form.controls.legalName.markAsTouched();
        break;
      case ERROR_CODES.INVALID_COMMERCIAL_NAME:
        this.form.controls.commercialName.setErrors({
          serverError: body?.message ?? 'Invalid commercial name.',
        });
        this.form.controls.commercialName.markAsTouched();
        break;
      case ERROR_CODES.INVALID_COUNTRY_CODE:
        this.form.controls.country.setErrors({
          serverError: body?.message ?? 'Invalid country code.',
        });
        this.form.controls.country.markAsTouched();
        break;
      case ERROR_CODES.INVALID_PHONE_NUMBER:
        this.form.controls.contactPhone.setErrors({
          serverError: 'Must be a valid phone number (e.g. +1 555 000 0000).',
        });
        this.form.controls.contactPhone.markAsTouched();
        break;
      case ERROR_CODES.INVALID_WEBSITE_URL:
        this.form.controls.website.setErrors({
          serverError: 'Must be a valid HTTP or HTTPS URL (e.g. https://example.com).',
        });
        this.form.controls.website.markAsTouched();
        break;
      case ERROR_CODES.INVALID_ANNUAL_BILLING:
        this.form.controls.annualBillingUsd.setErrors({
          serverError: 'Must be a non-negative amount with at most 2 decimal places.',
        });
        this.form.controls.annualBillingUsd.markAsTouched();
        break;
      case ERROR_CODES.INVALID_SUPPLIER_ADDRESS:
        this.form.controls.address.setErrors({
          serverError: body?.message ?? 'Invalid address.',
        });
        this.form.controls.address.markAsTouched();
        break;
      default:
        this.serverError.set(
          err.status >= 500
            ? 'A server error occurred. Please try again later.'
            : (body?.message ?? 'An unexpected error occurred. Please try again.'),
        );
    }
  }
}
