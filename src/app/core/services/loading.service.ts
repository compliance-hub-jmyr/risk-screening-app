import { Injectable, signal } from '@angular/core';

/**
 * Loading State Service
 *
 * Global service for managing loading spinners and overlays.
 * Uses signals for reactive state management.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly loadingCount = signal(0);

  /**
   * Read-only signal indicating if any loading operation is in progress
   */
  readonly isLoading = signal(false);

  /**
   * Increment loading counter and update loading state
   */
  show(): void {
    this.loadingCount.update((count) => count + 1);
    this.isLoading.set(true);
  }

  /**
   * Decrement loading counter and update loading state
   */
  hide(): void {
    this.loadingCount.update((count) => {
      const newCount = Math.max(0, count - 1);
      if (newCount === 0) {
        this.isLoading.set(false);
      }
      return newCount;
    });
  }

  /**
   * Force reset loading state (useful for error recovery)
   */
  reset(): void {
    this.loadingCount.set(0);
    this.isLoading.set(false);
  }
}
