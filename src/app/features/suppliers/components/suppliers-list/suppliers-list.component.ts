import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Menu, MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { MenuItem } from 'primeng/api';

import { SupplierService } from '../../services';
import {
  RiskLevel,
  SupplierFilters,
  SupplierPageRequest,
  SupplierResponse,
  SupplierSortField,
  SupplierStatus,
} from '../../models';
import { PageMetadata } from '@/app/shared/models/api';
import { COUNTRIES, CountryOption } from '@/app/shared/data/countries.data';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';
import { ScreeningDialogComponent } from '@/app/features/screening/components/screening-dialog/screening-dialog.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

interface SelectOption<T extends string> {
  label: string;
  value: T | '';
}

@Component({
  selector: 'app-suppliers-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    SkeletonModule,
    IconFieldModule,
    InputIconModule,
    MenuModule,
    DialogModule,
    ConfirmDialogModule,
    SupplierFormComponent,
    ScreeningDialogComponent,
    DeleteConfirmDialogComponent
  ],
  templateUrl: './suppliers-list.component.html',
  host: { class: 'flex flex-1 flex-col min-h-0' },
})
export class SuppliersListComponent {
  private readonly supplierService = inject(SupplierService);

  // Table state
  protected readonly suppliers = signal<SupplierResponse[]>([]);
  protected readonly meta = signal<PageMetadata | null>(null);
  protected readonly loading = signal(true);
  protected readonly totalRecords = computed(() => this.meta()?.totalElements ?? 0);

  protected readonly pageSizeOptions = [10, 20, 50];
  protected readonly defaultPageSize = 20;

  // Pagination / sort state
  protected readonly defaultSortField: SupplierSortField = 'updatedAt';
  protected readonly defaultSortOrder = -1;

  private currentPage = signal(0);
  private currentSize = signal(this.defaultPageSize);
  private currentSortBy = signal<SupplierSortField>(this.defaultSortField);
  private currentSortDir = signal<'ASC' | 'DESC'>('DESC');

  // Mobile filters panel
  protected readonly filtersOpen = signal(false);
  protected toggleFilters(): void {
    this.filtersOpen.update((v) => !v);
  }

  // Filter form
  protected readonly filterForm = new FormGroup({
    legalName: new FormControl(''),
    taxId: new FormControl(''),
    country: new FormControl<string>(''),
    status: new FormControl<SupplierStatus | ''>(''),
    riskLevel: new FormControl<RiskLevel | ''>(''),
  });

  private readonly filterValues = toSignal(this.filterForm.valueChanges, {
    initialValue: this.filterForm.value,
  });

  protected readonly countryOptions: { label: string; value: string }[] = [
    { label: 'All countries', value: '' },
    ...COUNTRIES.map((c: CountryOption) => ({ label: `${c.name} (${c.code})`, value: c.code })),
  ];

  protected readonly statusOptions: SelectOption<SupplierStatus>[] = [
    { label: 'All statuses', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Under Review', value: 'UnderReview' },
  ];

  protected readonly riskOptions: SelectOption<RiskLevel>[] = [
    { label: 'All risk levels', value: '' },
    { label: 'None', value: 'None' },
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
  ];

  protected readonly hasActiveFilters = computed(() => {
    const v = this.filterValues();
    const hasFilters = !!(v.legalName || v.taxId || v.country || v.status || v.riskLevel);
    const hasSort =
      this.currentSortBy() !== this.defaultSortField || this.currentSortDir() !== 'DESC';
    return hasFilters || hasSort;
  });

  protected readonly activeFilterCount = computed(() => {
    const v = this.filterValues();
    const filterCount = [v.legalName, v.taxId, v.country, v.status, v.riskLevel].filter(
      Boolean,
    ).length;
    const sortActive =
      this.currentSortBy() !== this.defaultSortField || this.currentSortDir() !== 'DESC' ? 1 : 0;
    return filterCount + sortActive;
  });

  // Table reference
  protected readonly table = viewChild.required<Table>('table');
  protected readonly actionsMenu = viewChild.required<Menu>('actionsMenu');
  protected readonly activeSupplier = signal<SupplierResponse | null>(null);

  protected readonly rowMenuItems = computed<MenuItem[]>(() => {
    const s = this.activeSupplier();
    if (!s) return [];
    return [
      {
        label: 'View details',
        icon: 'pi pi-eye',
        command: () => {
          // TODO: Navigate to supplier details page when implemented
        },
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          if (s) this.openEditDialog(s);
        },
      },
      { separator: true },
      {
        label: 'Run screening',
        icon: 'pi pi-shield',
        command: () => {
          if (s) this.openScreeningDialog(s);
        },
      },
      { separator: true },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        styleClass: 'text-red-600',
        command: () => {
          if (s) this.openDeleteDialog(s);
        },
      },
    ];
  });

  protected openMenu(event: MouseEvent, supplier: SupplierResponse): void {
    this.activeSupplier.set(supplier);
    this.actionsMenu().toggle(event);
  }

  // Create dialog
  protected readonly createDialogVisible = signal(false);

  protected openCreateDialog(): void {
    this.createDialogVisible.set(true);
  }

  protected onSupplierCreated(): void {
    this.createDialogVisible.set(false);
    this.currentPage.set(0);
    this.load();
  }

  // Edit dialog
  protected readonly editDialogVisible = signal(false);
  protected readonly editingSupplier = signal<SupplierResponse | null>(null);

  protected openEditDialog(supplier: SupplierResponse): void {
    this.editingSupplier.set(supplier);
    this.editDialogVisible.set(true);
  }

  protected onSupplierUpdated(): void {
    this.editDialogVisible.set(false);
    this.editingSupplier.set(null);
    this.load();
  }

  // Screening dialog
  protected readonly screeningDialogVisible = signal(false);
  protected readonly screeningSupplier = signal<SupplierResponse | null>(null);

  protected openScreeningDialog(supplier: SupplierResponse): void {
    this.screeningSupplier.set(supplier);
    this.screeningDialogVisible.set(true);
  }

  protected closeScreeningDialog(): void {
    this.screeningDialogVisible.set(false);
    this.screeningSupplier.set(null);
  }

  // Delete dialog
  protected readonly deleteDialogVisible = signal(false);
  protected readonly deletingSupplier = signal<SupplierResponse | null>(null);

  protected openDeleteDialog(supplier: SupplierResponse): void {
    this.deletingSupplier.set(supplier);
    this.deleteDialogVisible.set(true);
  }

  protected onSupplierDeleted(): void {
    this.deleteDialogVisible.set(false);
    this.deletingSupplier.set(null);
    this.currentPage.set(0);
    this.load();
  }

  protected closeDeleteDialog(): void {
    this.deleteDialogVisible.set(false);
    this.deletingSupplier.set(null);
  }

  constructor() {
    this.filterForm.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(0);
      this.load();
    });
  }

  // Table lazy load
  protected onLazyLoad(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? this.defaultPageSize;
    this.currentPage.set(Math.floor(first / rows));
    this.currentSize.set(rows);

    if (event.sortField) {
      const field = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
      this.currentSortBy.set(this.mapSortField(field));
      this.currentSortDir.set(event.sortOrder === 1 ? 'ASC' : 'DESC');
    }

    this.load();
  }

  protected clearFilters(): void {
    this.filterForm.reset({ legalName: '', taxId: '', country: '', status: '', riskLevel: '' });
    this.currentSortBy.set(this.defaultSortField);
    this.currentSortDir.set('DESC');
    this.currentPage.set(0);
    const t = this.table();
    t.sortField = this.defaultSortField;
    t.sortOrder = this.defaultSortOrder;
    t.tableService.onSort({ field: this.defaultSortField, order: this.defaultSortOrder });
  }

  // Badge helpers
  protected statusSeverity(
    status: SupplierStatus,
  ): 'success' | 'warn' | 'danger' | 'secondary' | 'info' {
    const map: Record<SupplierStatus, 'success' | 'warn' | 'danger' | 'secondary' | 'info'> = {
      Approved: 'success',
      Pending: 'warn',
      Rejected: 'danger',
      UnderReview: 'info',
    };
    return map[status];
  }

  protected statusLabel(status: SupplierStatus): string {
    const map: Record<SupplierStatus, string> = {
      Approved: 'Approved',
      Pending: 'Pending',
      Rejected: 'Rejected',
      UnderReview: 'Under Review',
    };
    return map[status];
  }

  protected riskSeverity(risk: RiskLevel): 'success' | 'warn' | 'danger' | 'secondary' | 'info' {
    const map: Record<RiskLevel, 'success' | 'warn' | 'danger' | 'secondary' | 'info'> = {
      None: 'secondary',
      Low: 'success',
      Medium: 'warn',
      High: 'danger',
    };
    return map[risk];
  }

  // Private
  private load(): void {
    this.loading.set(true);
    const request: SupplierPageRequest = {
      page: this.currentPage(),
      size: this.currentSize(),
      sortBy: this.currentSortBy(),
      sortDirection: this.currentSortDir(),
      ...this.buildFilters(),
    };

    this.supplierService.getAll(request).subscribe({
      next: (page) => {
        this.suppliers.set(page.content);
        this.meta.set(page.meta);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private buildFilters(): SupplierFilters {
    const v = this.filterForm.value;
    const f: SupplierFilters = {};
    if (v.legalName?.trim()) f.legalName = v.legalName.trim();
    if (v.taxId?.trim()) f.taxId = v.taxId.trim();
    if (v.country) f.country = v.country;
    if (v.status) f.status = v.status;
    if (v.riskLevel) f.riskLevel = v.riskLevel;
    return f;
  }

  private mapSortField(field: string): SupplierSortField {
    const allowed: SupplierSortField[] = [
      'legalName',
      'commercialName',
      'taxId',
      'country',
      'status',
      'riskLevel',
      'createdAt',
      'updatedAt',
    ];
    return allowed.includes(field as SupplierSortField)
      ? (field as SupplierSortField)
      : 'updatedAt';
  }
}
