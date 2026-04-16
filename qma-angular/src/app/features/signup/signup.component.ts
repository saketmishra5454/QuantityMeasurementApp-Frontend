import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  isSubmitting = false;

  signupForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9 ]{10,15}$/)]]
  });

  get username() {
    return this.signupForm.controls.username;
  }

  get email() {
    return this.signupForm.controls.email;
  }

  get password() {
    return this.signupForm.controls.password;
  }

  get phoneNumber() {
    return this.signupForm.controls.phoneNumber;
  }

  submit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.authService.signup(this.signupForm.getRawValue()).subscribe({
      next: () => {
        this.notificationService.success(
          'Account created',
          `${this.username.value}, your Quantora account is ready. Please log in to continue.`
        );
        void this.router.navigateByUrl('/login');
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.notificationService.error(
          'Sign up failed',
          this.getErrorMessage(error, 'We could not create your account. Please review your details and try again.')
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
