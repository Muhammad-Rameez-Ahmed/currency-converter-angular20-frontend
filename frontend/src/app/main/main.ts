import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Currency } from '../core/services/currency';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { HighlightNewDirective } from '../core/directive/highlight-new.directive';
import { lastValueFrom } from 'rxjs';

interface CurrencyInfo {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
  type: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    HighlightNewDirective,
    MatProgressBarModule
  ],
  styleUrls: ['./main.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Main implements OnInit {

  private $currencyService = inject(Currency);
  currencies: string[] = [];
  currencyNames: Record<string, CurrencyInfo> = {};
  isLoading = signal(false);
  result: number | null = null;
  history: any[] = [];

 

  constructor() { }

  loadSymbols() {
    lastValueFrom(this.$currencyService.getSymbols()).then(res => {
        this.currencies = Object.keys(res.data);
        this.currencyNames = res.data;
        console.log(this.currencyNames);
      })
      .catch(err => {
        console.log('Error loading symbols:', err);
      });
  }

  ngOnInit() {
    this.loadSymbols();
    this.history = JSON.parse(localStorage.getItem('currencyHistory') || '[]');
  }

   currencyForm = new FormGroup({
    amount: new FormControl(1, [Validators.required, Validators.min(0.01)]),
    fromCurrency: new FormControl('', Validators.required),
    toCurrency: new FormControl('', Validators.required)
  });

  convert() {
    if (this.currencyForm.invalid) return;

    const { fromCurrency, toCurrency, amount } = this.currencyForm.value!;
    this.isLoading.set(true)

    lastValueFrom(
      this.$currencyService.convertCurrency(fromCurrency!, toCurrency!, amount!)).then(res => {
        // console.log(res);
        if (res) {
          this.isLoading.set(false)
          console.log(this.isLoading);

          this.result = res.convertedAmount;
          console.log("result", this.result);

          const record = {
            amount,
            from: fromCurrency,
            to: toCurrency,
            result: this.result,
            date: new Date().toLocaleString()
          };

          this.history.unshift(record);
          localStorage.setItem('currencyHistory', JSON.stringify(this.history));
        }
      })
      .catch(err => {
        this.isLoading.set(false)
        console.log('Conversion error:', err);
      })
      .finally(() => {
        this.isLoading.set(false)
      });
  }

  trackByDate(index: number, item: any) {
    return item.date;
  }
removeHistoryItem(item: any) {
  this.history = this.history.filter(h => h !== item);
}

}
