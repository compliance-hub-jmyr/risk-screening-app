import { Component, inject } from '@angular/core';
import { LoadingService } from '@/app/core/services';
import { ProgressSpinner } from 'primeng/progressspinner';

/**
 * Global Loading Spinner Component
 *
 * Displays a fullscreen loading overlay when LoadingService.isLoading is true.
 * Optional - can be placed in a root app component for the global loading state.
 */
@Component({
  selector: 'app-loading-spinner',
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
