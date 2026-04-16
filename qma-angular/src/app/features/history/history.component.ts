import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ConversionHistoryItem, HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-history',
  imports: [DatePipe, NgFor, NgIf, RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  history: ConversionHistoryItem[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly historyService: HistoryService
  ) {}

  get username(): string {
    return this.authService.getUsername() ?? 'Member';
  }

  get successfulCount(): number {
    return this.history.filter((item) => !item.error).length;
  }

  get errorCount(): number {
    return this.history.filter((item) => item.error).length;
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.historyService.getHistory().subscribe({
      next: (history) => {
        this.history = [...history].sort((a, b) => {
          const first = new Date(a.createdAt ?? 0).getTime();
          const second = new Date(b.createdAt ?? 0).getTime();
          return second - first;
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load history. Please check Spring Boot and your login token.';
        this.isLoading = false;
      }
    });
  }

  displayResult(item: ConversionHistoryItem): string {
    if (item.error) {
      return item.errorMessage ?? 'Error';
    }

    if (item.resultString) {
      return item.resultString;
    }

    if (item.resultValue !== null && item.resultUnit) {
      return `${this.format(item.resultValue)} ${item.resultUnit}`;
    }

    return 'Saved';
  }

  private format(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 4
    }).format(value);
  }
}
