import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { UserService } from '../../../shared/services/user/user.service';
import { IPaymentType, IResponse } from '../../interfaces/index';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { UserModel } from '../../models/user.model';
import { PaymentInstructionsService } from '../../services/payment-instructions/payment-instructions.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-payment-instruction',
  templateUrl: './payment-instruction.component.html',
  providers: [PaymentInstructionsService, PaymenttypeService],
  styleUrls: ['./payment-instruction.component.scss']
})
export class PaymentInstructionComponent implements OnInit {
  model: PaymentInstructionModel = new PaymentInstructionModel();
  paymentTypes: IPaymentType[] = [];
  changePayment = false;
  newId: number;
  newDailySequenceId: number;
  paymentInstructionSuggestion = false;

  constructor(
    private _paymentInstructionService: PaymentInstructionsService,
    private _paymentTypeService: PaymenttypeService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => this.onRouteParams(params), err => console.log(err));
    this.getPaymentTypes();
  }

  get cleanModel(): PaymentInstructionModel {
    const model = new PaymentInstructionModel;
    Object.keys(this.model).forEach(key => (this.model[key] !== '') ? model[key] = this.model[key] : null);
    return model;
  }

  get hasPopulatedField(): boolean {
    return (Object.keys(this.model).filter(key => {
      if (key === 'currency' || key === 'unallocated_amount' || key === 'payment_type') {
        return false;
      }
      return this.model[key].length > 0;
    }).length > 0);
  }

  get window(): Window {
    return window;
  }

  get continueToPaymentUrl(): string {
    switch (this._userService.getUser().type) {
      case UserModel.TYPES.postclerk.type:
        return ['/dashboard/payment/edit/', this.newId].join('');
      case UserModel.TYPES.feeclerk.type:
        return ['/feelog/edit/', this.newId].join('');
      default:
        return '';
    }
  }

  get getPaymentInstructionListUrl(): string {
    switch (this._userService.getUser().type) {
      case UserModel.TYPES.postclerk.type:
        return ['/paymentslog'].join('');
      case UserModel.TYPES.feeclerk.type:
        return ['/feelog'].join('');
      default:
        return '';
    }
  }

  get user() {
    return this._userService.getUser();
  }
  // ------------------------------------------------------------------------------------------
  getPaymentInstructionById(paymentID): void {
    this._paymentInstructionService
      .getPaymentInstructionById(paymentID)
      .subscribe((response: IResponse) => this.model = response.data, err => console.log(err));
  }

  getPaymentTypes(): void {
    this._paymentTypeService.getPaymentTypes()
      .then((response: IResponse) => this.paymentTypes = response.data.map(paymentType => ({ id: paymentType.id, name: paymentType.name })))
      .catch(err => console.log(err));
  }
  // ------------------------------------------------------------------------------------------
  onFormSubmission(e?): void {
    if (e) {
      e.preventDefault();
    }

    const { type } = this._userService.getUser();
    this._paymentInstructionService.savePaymentInstruction(this.cleanModel)
      .subscribe(
        (response: IResponse) => {
          if (!response.data && response.success) {
            return this._router.navigateByUrl('paymentslog');
          }
          this.model = new PaymentInstructionModel();
          this.model.assign(response.data);
          this.newDailySequenceId = _.assign(this.model.daily_sequence_id);
          this.newId = _.assign(this.model.id);
          if ((response.data && response.data.status === PaymentStatus.DRAFT) && type === UserModel.TYPES.feeclerk.type) {
            this.model.status = PaymentStatus.PENDING;
            this.onFormSubmission();
          }
          this.model.resetData();
          this.paymentInstructionSuggestion = true;
        },
        err => console.log(err)
      );
    }

  onRouteParams(params): void {
    if (params.id && /[0-9]/.test(params.id)) {
      this.getPaymentInstructionById(params.id);
      this.changePayment = (this._router.url.includes('/change-payment'));
    }
  }
}
