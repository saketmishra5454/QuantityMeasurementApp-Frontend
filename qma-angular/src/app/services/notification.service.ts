import { Injectable, signal } from '@angular/core';

export type NotificationTone = 'success' | 'error' | 'info';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  tone: NotificationTone;
  durationMs: number;
}

interface NotificationInput {
  title: string;
  message: string;
  tone: NotificationTone;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly notifications = signal<AppNotification[]>([]);
  private nextId = 1;

  success(title: string, message: string, durationMs = 3200): void {
    this.show({ title, message, tone: 'success', durationMs });
  }

  error(title: string, message: string, durationMs = 4200): void {
    this.show({ title, message, tone: 'error', durationMs });
  }

  info(title: string, message: string, durationMs = 2800): void {
    this.show({ title, message, tone: 'info', durationMs });
  }

  dismiss(id: number): void {
    this.notifications.update((items) => items.filter((item) => item.id !== id));
  }

  private show(input: NotificationInput): void {
    const notification: AppNotification = {
      id: this.nextId++,
      title: input.title,
      message: input.message,
      tone: input.tone,
      durationMs: input.durationMs ?? 3200
    };

    this.notifications.update((items) => [...items, notification]);

    window.setTimeout(() => this.dismiss(notification.id), notification.durationMs);
  }
}
