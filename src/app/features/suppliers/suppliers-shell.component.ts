import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Suppliers Shell — placeholder component.
 */
@Component({
  selector: 'app-suppliers-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full items-center justify-center">
      <p class="text-surface-500">Suppliers — coming soon</p>
    </div>
  `,
})
export class SuppliersShellComponent {}
