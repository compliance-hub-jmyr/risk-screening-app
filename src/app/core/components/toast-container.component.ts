import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '@/app/core';

@Component({
  selector: 'app-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Toast],
  template: '<p-toast />',
  styles: '',
  providers: [MessageService],
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);

  constructor() {
    this.toastService.setMessageService(inject(MessageService));
  }
}
