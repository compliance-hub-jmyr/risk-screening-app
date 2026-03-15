import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { LoadingService } from '@/app/core';

@Component({
  selector: 'app-loading-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressSpinner],
  template: `
    @if (loadingService.isLoading()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div class="rounded-lg bg-white p-8 shadow-xl">
          <p-progressSpinner strokeWidth="4" fill="transparent" animationDuration="1s" />
        </div>
      </div>
    }
  `,
  styles: '',
})
export class LoadingSpinnerComponent {
  protected readonly loadingService = inject(LoadingService);
}
