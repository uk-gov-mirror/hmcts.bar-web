import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PaymentslogService {

  constructor(private http: HttpClient) { }

  getPaymentsLog() {
    return this.http
      .get(`${environment.apiUrl}/paymentsLog`)
      .toPromise();
  }

}
