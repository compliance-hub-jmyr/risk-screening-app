import { ChangeDetectionStrategy, Component, computed, input, output, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { RiskLevel, SupplierResponse, SupplierStatus } from '../../models';
import { COUNTRIES, CountryOption } from '@/app/shared/data/countries.data';

@Component({
  selector: 'app-supplier-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DecimalPipe, ButtonModule, TagModule, TranslocoModule],
  templateUrl: './supplier-details.component.html',
})
export class SupplierDetailsComponent {
  private readonly translocoService = inject(TranslocoService);

  readonly supplier = input.required<SupplierResponse>();
  readonly closed = output<void>();

  private readonly countryMap = new Map<string, string>(
    COUNTRIES.map((c: CountryOption) => [c.code, c.name]),
  );

  protected readonly countryLabel = computed(() => {
    const code = this.supplier().country;
    const name = this.countryMap.get(code);
    return name ? `${name} (${code})` : code;
  });

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
      Approved: this.translocoService.translate('suppliers.details.status.approved'),
      Pending: this.translocoService.translate('suppliers.details.status.pending'),
      Rejected: this.translocoService.translate('suppliers.details.status.rejected'),
      UnderReview: this.translocoService.translate('suppliers.details.status.underReview'),
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

  protected riskLabel(risk: RiskLevel): string {
    const map: Record<RiskLevel, string> = {
      None: this.translocoService.translate('suppliers.riskLevel.none'),
      Low: this.translocoService.translate('suppliers.riskLevel.low'),
      Medium: this.translocoService.translate('suppliers.riskLevel.medium'),
      High: this.translocoService.translate('suppliers.riskLevel.high'),
    };
    return map[risk];
  }
}
