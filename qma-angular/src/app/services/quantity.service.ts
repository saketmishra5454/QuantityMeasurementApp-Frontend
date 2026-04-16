import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from './api.config';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class QuantityService {

  private readonly baseUrl = API_CONFIG.QUANTITY_URL;

  constructor(private readonly http: HttpClient) {}

  convert(data: TwoQuantityRequest): Observable<QuantityDto> {
    return this.http.post<QuantityDto>(`${this.baseUrl}/convert`, data);
  }

  add(data: TwoQuantityRequest): Observable<QuantityDto> {
    return this.http.post<QuantityDto>(`${this.baseUrl}/add`, data);
  }

  subtract(data: TwoQuantityRequest): Observable<QuantityDto> {
    return this.http.post<QuantityDto>(`${this.baseUrl}/subtract`, data);
  }

  compare(data: TwoQuantityRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/compare`, data);
  }

  divide(data: TwoQuantityRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/divide`, data);
  }

  getHistory() {
    return this.http.get(`${this.baseUrl}/getHistory`);
  }
}
