import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { SupplierService } from '../../services';
import { SupplierResponse } from '../../models';
import { ToastService } from '@/app/core/services/toast.service';

@Component({
  selector: 'app-delete-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ButtonModule, InputTextModule, TranslocoModule],
  template: `
    <div class="flex flex-col gap-5" *transloco="let t">
      <!-- Warning banner -->
      <div class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <i class="pi pi-exclamation-triangle mt-0.5 text-lg text-red-500" aria-hidden="true"></i>
        <div class="text-sm text-red-800">
          <p class="font-semibold">{{ t('suppliers.dialogs.delete.cannotUndo') }}</p>
          <p class="mt-1">
            {{ t('suppliers.dialogs.delete.deleteWarning', { name: supplier().legalName }) }}
          </p>
        </div>
      </div>

      <!-- Typed confirmation -->
      <div class="flex flex-col gap-1.5">
        <label for="confirm-name" class="text-sm font-medium text-surface-700">
          {{ t('suppliers.dialogs.delete.typeToConfirm', { name: supplier().legalName }) }}
        </label>
        <input
          pInputText
          id="confirm-name"
          type="text"
          [(ngModel)]="typedNameValue"
          [placeholder]="supplier().legalName"
          autocomplete="off"
          spellcheck="false"
          class="w-full font-mono text-sm"
          aria-describedby="confirm-name-hint"
        />
        <p id="confirm-name-hint" class="text-xs text-surface-400">
          {{ t('suppliers.dialogs.delete.exactMatch') }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-1">
        <button
          pButton
          type="button"
          class="p-button-outlined p-button-secondary"
          [disabled]="deleting()"
          (click)="cancelled.emit()"
        >
          <span pButtonLabel>{{ t('suppliers.dialogs.delete.cancel') }}</span>
        </button>
        <button
          pButton
          type="button"
          class="p-button-danger"
          [disabled]="!canDelete() || deleting()"
          (click)="confirmDelete()"
          [attr.aria-label]="t('suppliers.dialogs.delete.confirmDelete')"
        >
          @if (deleting()) {
            <span pButtonIcon class="pi pi-spin pi-spinner" aria-hidden="true"></span>
          } @else {
            <span pButtonIcon class="pi pi-trash" aria-hidden="true"></span>
          }
          <span pButtonLabel>{{
            deleting()
              ? t('suppliers.dialogs.delete.deleting')
              : t('suppliers.dialogs.delete.deleteSupplier')
          }}</span>
        </button>
      </div>
    </div>
  `,
})
export class DeleteConfirmDialogComponent {
  private readonly supplierService = inject(SupplierService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoService = inject(TranslocoService);

  readonly supplier = input.required<SupplierResponse>();
  readonly deleted = output<void>();
  readonly cancelled = output<void>();

  protected readonly typedName = signal('');
  protected readonly deleting = signal(false);

  // two-way binding shim for ngModel ↔ signal
  protected get typedNameValue(): string {
    return this.typedName();
  }
  protected set typedNameValue(v: string) {
    this.typedName.set(v);
  }

  protected readonly canDelete = computed(
    () => this.typedName().trim() === this.supplier().legalName,
  );

  protected confirmDelete(): void {
    if (!this.canDelete() || this.deleting()) return;

    this.deleting.set(true);
    this.supplierService
      .delete(this.supplier().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success(
            this.translocoService.translate('suppliers.messages.supplierDeleted'),
            this.translocoService.translate('suppliers.messages.supplierDeletedDetail', {
              name: this.supplier().legalName,
            }),
          );
          this.deleted.emit();
        },
        error: () => {
          this.deleting.set(false);
        },
      });
  }
}
