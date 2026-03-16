import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { ScreeningService } from '../../services';
import { ListSource, ScreeningEntry, ScreeningResponse } from '../../models';
import { SupplierResponse } from '@/app/features/suppliers/models';

type ScreeningState = 'idle' | 'loading' | 'success' | 'error';

interface SourceOption {
  label: string;
  fullName: string;
  url: string;
  value: ListSource;
  checked: boolean;
}

@Component({
  selector: 'app-screening-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ButtonModule, TagModule, CheckboxModule, SkeletonModule, TableModule],
  templateUrl: './screening-dialog.component.html',
})
export class ScreeningDialogComponent {
  private readonly screeningService = inject(ScreeningService);

  readonly supplier = input.required<SupplierResponse>();
  readonly closed = output<void>();

  // Source toggles — none checked by default, user must choose
  protected readonly sources = signal<SourceOption[]>([
    {
      label: 'OFAC',
      fullName: 'OFAC Sanctions List',
      url: 'https://sanctionssearch.ofac.treas.gov/',
      value: 'OFAC',
      checked: false,
    },
    {
      label: 'World Bank',
      fullName: 'The World Bank — Debarred Firms',
      url: 'https://projects.worldbank.org/en/projects-operations/procurement/debarred-firms',
      value: 'WORLD_BANK',
      checked: false,
    },
    {
      label: 'ICIJ',
      fullName: 'Offshore Leaks Database',
      url: 'https://offshoreleaks.icij.org',
      value: 'ICIJ',
      checked: false,
    },
  ]);

  protected readonly selectedSources = computed<ListSource[]>(() =>
    this.sources()
      .filter((s) => s.checked)
      .map((s) => s.value),
  );

  protected readonly noSourceSelected = computed(() => this.selectedSources().length === 0);

  // Screening state
  protected readonly state = signal<ScreeningState>('idle');
  protected readonly result = signal<ScreeningResponse | null>(null);

  protected readonly isIdle = computed(() => this.state() === 'idle');
  protected readonly isLoading = computed(() => this.state() === 'loading');
  protected readonly isSuccess = computed(() => this.state() === 'success');
  protected readonly isError = computed(() => this.state() === 'error');
  protected readonly hits = computed(() => this.result()?.hits ?? 0);

  // Per-source entry sets
  protected readonly ofacEntries = computed<ScreeningEntry[]>(
    () => this.result()?.entries.filter((e) => e.listSource === 'OFAC') ?? [],
  );
  protected readonly worldBankEntries = computed<ScreeningEntry[]>(
    () => this.result()?.entries.filter((e) => e.listSource === 'WORLD_BANK') ?? [],
  );
  protected readonly icijEntries = computed<ScreeningEntry[]>(
    () => this.result()?.entries.filter((e) => e.listSource === 'ICIJ') ?? [],
  );

  // Whether each source was part of the last executed search
  protected readonly ranOfac = computed(
    () => this.sources().find((s) => s.value === 'OFAC')?.checked ?? false,
  );
  protected readonly ranWorldBank = computed(
    () => this.sources().find((s) => s.value === 'WORLD_BANK')?.checked ?? false,
  );
  protected readonly ranIcij = computed(
    () => this.sources().find((s) => s.value === 'ICIJ')?.checked ?? false,
  );

  protected toggleSource(value: ListSource): void {
    this.sources.update((list) =>
      list.map((s) => (s.value === value ? { ...s, checked: !s.checked } : s)),
    );
  }

  protected runScreening(): void {
    const sources = this.selectedSources();
    if (sources.length === 0 || this.isLoading()) return;

    this.state.set('loading');
    this.result.set(null);

    this.screeningService.search({ q: this.supplier().legalName, sources }).subscribe({
      next: (res) => {
        this.result.set(res);
        this.state.set('success');
      },
      error: () => {
        this.state.set('error');
      },
    });
  }

  // ── Display helpers ────────────────────────────────────────────────────────

  protected sourceSeverity(source: ListSource): 'danger' | 'warn' | 'info' {
    const map: Record<ListSource, 'danger' | 'warn' | 'info'> = {
      OFAC: 'danger',
      WORLD_BANK: 'warn',
      ICIJ: 'info',
    };
    return map[source];
  }

  protected formatScore(score: number | null): string {
    return score !== null ? `${score.toFixed(1)}%` : '—';
  }

  protected scoreSeverity(score: number | null): string {
    if (score === null) return '';
    if (score >= 90) return 'bg-red-100 text-red-700';
    if (score >= 70) return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  }

  protected formatDateRange(from: string | null, to: string | null): string {
    if (!from && !to) return '—';
    return `${from ?? '?'} – ${to ?? 'present'}`;
  }
}
