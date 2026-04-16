import { NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { QuantityDto, QuantityService, TwoQuantityRequest } from '../../services/quantity.service';

type QuantityType = 'length' | 'temperature' | 'volume' | 'weight';
type Operation = 'convert' | 'add' | 'subtract' | 'divide' | 'compare';

interface QuantityCard {
  id: QuantityType;
  label: string;
  icon: string;
  accent: string;
}

interface UnitOption {
  label: string;
  value: string;
  localKey: string;
}

@Component({
  selector: 'app-converter',
  imports: [FormsModule, NgFor],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css'
})
export class ConverterComponent {
  selectedType: QuantityType = 'length';
  selectedOperation: Operation = 'convert';
  fromValue = 1;
  toValue: number | null = null;
  fromUnit = 'FEET';
  toUnit = 'INCHES';
  resultText = '1 Feet = 12 Inches';
  resultTone: 'info' | 'success' | 'warning' = 'info';
  historyStatus = 'Login to save calculations in history.';
  isCalculating = false;

  quantityCards: QuantityCard[] = [
    { id: 'length', label: 'Length', icon: 'image/length.png', accent: '#06b6d4' },
    { id: 'temperature', label: 'Temperature', icon: 'image/thermometer.png', accent: '#f43f5e' },
    { id: 'volume', label: 'Volume', icon: 'image/volume.png', accent: '#7c3aed' },
    { id: 'weight', label: 'Weight', icon: 'image/weightSymbol.svg', accent: '#f59e0b' }
  ];

  operations: { id: Operation; label: string; symbol: string }[] = [
    { id: 'convert', label: 'Convert', symbol: 'C' },
    { id: 'add', label: 'Add', symbol: '+' },
    { id: 'subtract', label: 'Subtract', symbol: '-' },
    { id: 'divide', label: 'Divide', symbol: '/' },
    { id: 'compare', label: 'Compare', symbol: '=' }
  ];

  units: Record<QuantityType, UnitOption[]> = {
    length: [
      { label: 'Feet', value: 'FEET', localKey: 'foot' },
      { label: 'Inches', value: 'INCHES', localKey: 'inch' },
      { label: 'Yards', value: 'YARDS', localKey: 'yard' },
      { label: 'Centimeters', value: 'CENTIMETERS', localKey: 'centimeter' }
    ],
    temperature: [
      { label: 'Celsius', value: 'CELSIUS', localKey: 'celsius' },
      { label: 'Fahrenheit', value: 'FAHRENHEIT', localKey: 'fahrenheit' },
      { label: 'Kelvin', value: 'KELVIN', localKey: 'kelvin' }
    ],
    volume: [
      { label: 'Litre', value: 'LITRE', localKey: 'liter' },
      { label: 'Millilitre', value: 'MILLILITRE', localKey: 'milliliter' },
      { label: 'Gallon', value: 'GALLON', localKey: 'gallon' }
    ],
    weight: [
      { label: 'Milligram', value: 'MILLIGRAM', localKey: 'milligram' },
      { label: 'Gram', value: 'GRAM', localKey: 'gram' },
      { label: 'Kilogram', value: 'KILOGRAM', localKey: 'kilogram' },
      { label: 'Pound', value: 'POUND', localKey: 'pound' },
      { label: 'Tonne', value: 'TONNE', localKey: 'tonne' }
    ]
  };

  constructor(
    private readonly authService: AuthService,
    private readonly quantityService: QuantityService
  ) {}

  get currentUnits(): UnitOption[] {
    return this.units[this.selectedType];
  }

  get selectedCard(): QuantityCard {
    return this.quantityCards.find((card) => card.id === this.selectedType) ?? this.quantityCards[0];
  }

  selectType(type: QuantityType): void {
    this.selectedType = type;
    this.fromUnit = this.units[type][0].value;
    this.toUnit = this.units[type][1]?.value ?? this.units[type][0].value;
    this.toValue = null;
    this.resultText = `Ready to calculate ${type}.`;
    this.resultTone = 'info';
    this.historyStatus = this.authService.isLoggedIn()
      ? 'Your next result will be saved to history.'
      : 'Login to save calculations in history.';
  }

  selectOperation(operation: Operation): void {
    this.selectedOperation = operation;
    this.resultText = `${this.operationLabel(operation)} mode selected.`;
    this.resultTone = 'info';
  }

  calculate(): void {
    if (this.fromValue === null || Number.isNaN(Number(this.fromValue))) {
      this.showWarning('Please enter the FROM value first.');
      return;
    }

    if (['add', 'subtract', 'divide', 'compare'].includes(this.selectedOperation) && this.toValue === null) {
      this.showWarning('Please enter the TO value for this operation.');
      return;
    }

    this.isCalculating = true;
    this.historyStatus = this.authService.isLoggedIn()
      ? 'Saving result to your history...'
      : 'Calculating with backend...';

    this.runOperation(this.createBackendRequest()).subscribe({
      next: (response: QuantityDto | boolean | number) => {
        this.resultText = this.toResultText(response);
        this.resultTone = 'success';
        this.historyStatus = this.authService.isLoggedIn()
          ? 'Calculation complete and saved to your history.'
          : 'Calculation complete. Login to save history.';
        this.isCalculating = false;
      },
      error: (error: HttpErrorResponse) => {
        this.resultTone = 'warning';
        this.resultText = error?.error?.message ?? 'Backend could not process this calculation.';
        this.historyStatus = this.authService.isLoggedIn()
          ? 'Calculation failed. Nothing was saved.'
          : 'Calculation failed. Check backend availability and request values.';
        this.isCalculating = false;
      }
    });
  }

  private createBackendRequest(): TwoQuantityRequest {
    const secondValue = Number(this.toValue ?? 0);

    return {
      q1: {
        value: Number(this.fromValue),
        unit: this.fromUnit,
        measurementType: this.backendMeasurementType()
      },
      q2: {
        value: this.selectedOperation === 'convert' ? 0 : secondValue,
        unit: this.toUnit,
        measurementType: this.backendMeasurementType()
      },
      targetUnit: ['add', 'subtract'].includes(this.selectedOperation)
        ? {
            value: 0,
            unit: this.toUnit,
            measurementType: this.backendMeasurementType()
          }
        : undefined
    };
  }

  private runOperation(request: TwoQuantityRequest): Observable<QuantityDto | boolean | number> {
    switch (this.selectedOperation) {
      case 'convert':
        return this.quantityService.convert(request);
      case 'add':
        return this.quantityService.add(request);
      case 'subtract':
        return this.quantityService.subtract(request);
      case 'divide':
        return this.quantityService.divide(request);
      case 'compare':
        return this.quantityService.compare(request);
    }
  }

  private operationLabel(operation: Operation): string {
    return this.operations.find((item) => item.id === operation)?.label ?? 'Convert';
  }

  private unitLabel(unitValue: string): string {
    return this.currentUnits.find((unit) => unit.value === unitValue)?.label ?? unitValue;
  }

  private backendMeasurementType(): string {
    return this.selectedType.toUpperCase();
  }

  private format(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 4
    }).format(value);
  }

  private showWarning(message: string): void {
    this.resultText = message;
    this.resultTone = 'warning';
  }

  private toResultText(response: QuantityDto | boolean | number): string {
    if (typeof response === 'boolean') {
      return response
        ? `${this.format(this.fromValue)} ${this.unitLabel(this.fromUnit)} is equal to ${this.format(Number(this.toValue ?? 0))} ${this.unitLabel(this.toUnit)}.`
        : `${this.format(this.fromValue)} ${this.unitLabel(this.fromUnit)} is not equal to ${this.format(Number(this.toValue ?? 0))} ${this.unitLabel(this.toUnit)}.`;
    }

    if (typeof response === 'number') {
      return `Division result: ${this.format(response)}`;
    }

    return `${this.operationLabel(this.selectedOperation)} result: ${this.format(response.value)} ${this.unitLabel(response.unit)}`;
  }
}
