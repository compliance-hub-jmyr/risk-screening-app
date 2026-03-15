import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

/**
 * Toast Notification Service
 *
 * Global service for displaying toast notifications using PrimeNG Toast.
 * Wraps PrimeNG MessageService for easier usage.
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService?: MessageService;

  /**
   * Sets the MessageService instance (called by ToastContainerComponent)
   */
  setMessageService(messageService: MessageService): void {
    this.messageService = messageService;
  }

  /**
   * Gets the underlying PrimeNG MessageService
   */
  getMessageService(): MessageService | undefined {
    return this.messageService;
  }

  /**
   * Display a success toast
   */
  success(detail: string, summary = 'Success', life = 5000): void {
    this.messageService?.add({ severity: 'success', summary, detail, life });
  }

  /**
   * Display an info toast
   */
  info(detail: string, summary = 'Info', life = 5000): void {
    this.messageService?.add({ severity: 'info', summary, detail, life });
  }

  /**
   * Display a warning toast
   */
  warn(detail: string, summary = 'Warning', life = 5000): void {
    this.messageService?.add({ severity: 'warn', summary, detail, life });
  }

  /**
   * Display an error toast
   */
  error(detail: string, summary = 'Error', life = 7000): void {
    this.messageService?.add({ severity: 'error', summary, detail, life });
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this.messageService?.clear();
  }
}
