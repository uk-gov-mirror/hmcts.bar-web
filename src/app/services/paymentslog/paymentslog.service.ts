import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { SearchModel } from '../../models/search.model';
import { CaseReference } from '../../models/case-reference';

@Injectable()
export class PaymentslogService {

  constructor(private http: HttpClient) { }

  getPaymentsLog (status: PaymentStatus): Promise<any> {
    return this.http
      .get(`${environment.apiUrl}/payment-instructions?status=${status}`)
      .toPromise();
  }

  getPaymentById (paymentID: number): Promise<any> {
    return this.http
      .get(`${environment.apiUrl}/payment-instructions/${paymentID}`)
      .toPromise();
  }

  sendPendingPayments (data): Promise<any> {
    return this.http
      .post(`${environment.apiUrl}/payment-instructions`, data)
      .toPromise();
  }

  deletePaymentLogById (paymentID: number): Promise<any> {
    return this.http
      .delete(`${environment.apiUrl}/payment-instructions/${paymentID}`)
      .toPromise();
  }

  createCaseNumber (caseReferenceModel: CaseReference): Promise<any> {
    return this.http
      .post(`${environment.apiUrl}/payment-instructions/${caseReferenceModel.paymentInstructionId}/cases`, {
        case_reference: caseReferenceModel.caseReference
      })
      .toPromise();
  }

  searchPayments (searchString: string): Promise<any> {
    return this.http
      .get(`${environment.apiUrl}/payment-instructions/search?q=${searchString}`)
      .toPromise();
  }

  searchPaymentsByDate(searchModel: SearchModel) {
    return this.http
      .get(`${environment.apiUrl}/payment-instructions/search?startDate=${searchModel.startDate}&endDate=${searchModel.endDate}`)
      .toPromise();
  }

}
