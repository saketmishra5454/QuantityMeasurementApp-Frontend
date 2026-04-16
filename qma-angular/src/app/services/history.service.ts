import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from './api.config';

export interface QuantityDto {
  value: number;
  unit: string;
  measurementType: string;
}

export interface TwoQuantityRequest {
  q1: QuantityDto;
  q2: QuantityDto;
  targetUnit?: QuantityDto;
}

export interface ConversionHistoryItem {
  id: number;
  thisValue: number;
  thisUnit: string;
  thisMeasurementType: string;
  thatValue: number | null;
  thatUnit: string | null;
  thatMeasurementType: string | null;
  operation: string;
  resultValue: number | null;
  resultUnit: string | null;
  resultMeasurementType: string | null;
  resultString: string | null;
  error: boolean;
  errorMessage: string | null;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private readonly quantityUrl = API_CONFIG.QUANTITY_URL;

  constructor(private readonly http: HttpClient) {}

  runOperation(operation: string, request: TwoQuantityRequest): Observable<unknown> {
    return this.http.post(`${this.quantityUrl}/${operation}`, request);
  }

  getHistory(): Observable<ConversionHistoryItem[]> {
    return this.http.get<ConversionHistoryItem[]>(`${this.quantityUrl}/getHistory`);
  }
}
