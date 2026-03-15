import { Component, inject } from '@angular/core';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '@/app/core/services';

/**
 * Global Toast Container Component
 *
 * Displays toast notifications from ToastService using PrimeNG Toast.
 * Should be placed once in the root app component.
 */
@Component({
  selector: 'app-toast-container',
  imports: [Toast],
  template: '<p-toast />',
  styles: '',
  providers: [MessageService],
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);
  protected readonly messageService = inject(MessageService);

  constructor() {
    this.toastService.setMessageService(this.messageService);
  }
}
