import { NgClass, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-center',
  imports: [NgClass, NgFor],
  templateUrl: './notification-center.component.html',
  styleUrl: './notification-center.component.css'
})
export class NotificationCenterComponent {
  protected readonly notificationService = inject(NotificationService);

  dismiss(id: number): void {
    this.notificationService.dismiss(id);
  }
}
