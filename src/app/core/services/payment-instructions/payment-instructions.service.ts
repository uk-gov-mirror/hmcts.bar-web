import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PaymentInstructionModel} from '../../models/paymentinstruction.model';
import {CheckAndSubmit} from '../../models/check-and-submit';
import {PaymentCaseReference} from '../../models/payment-parent.model';
import {ICaseFeeDetail, IPaymentsLog} from '../../interfaces/payments-log';
import {FeeDetailModel} from '../../models/feedetail.model';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import { environment } from '../../../../environments/environment';
import { PaymentStatus } from '../../models/paymentstatus.model';

@Injectable()
export class PaymentInstructionsService {

  constructor(private _http: HttpClient) {}

  getPaymentInstructions(status?: PaymentStatus[]): Observable<any> {
    let params = '';
    if (typeof status !== 'undefined') {
      params = `?status=${status.join(',')}`;
    }
    return this._http
      .get(`${environment.apiUrl}/payment-instructions${params}`);
  }

  savePaymentInstruction(paymentInstructionModel: PaymentInstructionModel) {
    return this._http
      .post(`${environment.apiUrl}/payment/${paymentInstructionModel.payment_type.id}`, paymentInstructionModel);
  }

  transformIntoCheckAndSubmitModels(paymentInstructions: IPaymentsLog[]): CheckAndSubmit[]  {
    const models = [];

    paymentInstructions.forEach((paymentInstruction: PaymentInstructionModel) => {
      if (paymentInstruction.case_fee_details.length < 1) {
        const checkAndSubmitModel = new CheckAndSubmit();
        checkAndSubmitModel.convertTo(paymentInstruction);
        models.push( checkAndSubmitModel );
        return;
      }

      paymentInstruction.case_fee_details.forEach((fee: ICaseFeeDetail) => {
        const checkAndSubmitModel = new CheckAndSubmit();
        const feeModel = new FeeDetailModel();
        feeModel.assign(fee);
        checkAndSubmitModel.convertTo(paymentInstruction, feeModel);

        if (feeModel.remission_amount !== null || feeModel.refund_amount !== null) {
          console.log( feeModel );
        }

        if (models.find(model => model.paymentId === feeModel.payment_instruction_id)) {
          checkAndSubmitModel.removeDuplicateProperties();
        }
        models.push( checkAndSubmitModel );
      });
    });
    return models;
  }


  transformIntoPaymentInstructionModel(checkAndSubmitModel: CheckAndSubmit): PaymentInstructionModel {
    const paymentInstructionModel: PaymentInstructionModel = new PaymentInstructionModel();
    paymentInstructionModel.id = checkAndSubmitModel.paymentId;
    paymentInstructionModel.payer_name = checkAndSubmitModel.name;
    paymentInstructionModel.amount = checkAndSubmitModel.paymentAmount;
    paymentInstructionModel.currency = 'GBP';
    paymentInstructionModel.payment_type = checkAndSubmitModel.paymentType;
    paymentInstructionModel.status = checkAndSubmitModel.status;
    paymentInstructionModel.payment_type = checkAndSubmitModel.paymentType;

    switch (paymentInstructionModel.payment_type.name) {
      case 'cheques':
        paymentInstructionModel.cheque_number = checkAndSubmitModel.chequeNumber;
        break;
      case 'postal-orders':
        paymentInstructionModel.postal_order_number = checkAndSubmitModel.postalOrderNumber;
        break;
      case 'allpay':
        paymentInstructionModel.all_pay_transaction_id = checkAndSubmitModel.allPayTransactionId;
        break;
      case 'cards':
        paymentInstructionModel.authorization_code = checkAndSubmitModel.authorizationCode;
        break;
    }

    return paymentInstructionModel;
  }

  transformJsonIntoPaymentInstructionModels(data): PaymentInstructionModel[] {
    const models: PaymentInstructionModel[] = [];
    data.forEach((payment: IPaymentsLog) => {
      const paymentInstruction = new PaymentInstructionModel();
      paymentInstruction.assign(payment);
      paymentInstruction.selected = false;
      models.push(paymentInstruction);
    });
    return models;
  }

}
