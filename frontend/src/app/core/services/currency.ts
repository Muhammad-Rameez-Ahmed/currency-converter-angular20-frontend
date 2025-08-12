import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })

export class Currency {
  constructor(private http: HttpClient) { }

  getSymbols(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/symbols`);
  }

  convertCurrency(from: string, to: string, amount: number) {
    return this.http.get<any>(`${environment.apiUrl}/convert`, {
      params: { from, to, amount: amount.toString() }
    });
  }
}
