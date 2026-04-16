import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { NotificationCenterComponent } from './shared/notification-center/notification-center.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NotificationCenterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  appName = 'Quantora';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    const username = this.authService.getUsername() ?? 'Member';
    this.authService.logout();
    this.notificationService.info('Signed out', `${username}, you have been logged out safely.`);
    void this.router.navigateByUrl('/login');
  }
}
