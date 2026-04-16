import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  isSubmitting = false;

  loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get username() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.notificationService.success(
          'Welcome back',
          `${this.username.value} is signed in and ready to measure.`
        );
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/converter';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.notificationService.error(
          'Login failed',
          this.getErrorMessage(error, 'We could not sign you in. Check your username and password.')
        );
      }
    });
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    return typeof error.error?.message === 'string' && error.error.message.trim()
      ? error.error.message
      : fallback;
  }
}
