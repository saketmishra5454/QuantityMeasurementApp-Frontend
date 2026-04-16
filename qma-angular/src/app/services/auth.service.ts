import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_CONFIG } from './api.config';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string | null;
  username: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authUrl = API_CONFIG.AUTH_URL;

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, request).pipe(
      tap((response) => this.storeSession(response.token, response.username))
    );
  }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, request).pipe(
      tap((response) => localStorage.setItem('quantora_username', response.username))
    );
  }

  getToken(): string | null {
    return localStorage.getItem('quantora_token');
  }

  getUsername(): string | null {
    return localStorage.getItem('quantora_username');
  }

  isLoggedIn(): boolean {
    return Boolean(this.getToken());
  }

  logout(): void {
    localStorage.removeItem('quantora_token');
    localStorage.removeItem('quantora_username');
  }

  private storeSession(token: string | null | undefined, username?: string): void {
    if (token) {
      localStorage.setItem('quantora_token', token);
    }

    if (username) {
      localStorage.setItem('quantora_username', username);
    }
  }
}
