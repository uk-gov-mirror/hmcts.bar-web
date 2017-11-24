import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { UserService } from '../../services/user/user.service';
import { IPaymentType } from '../../interfaces/payment-types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [PaymenttypeService],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  payment_types: IPaymentType[] = [];
  filledContent = false;
  showModal = false;
  newDataId = 0;

  data = {
    account_number: '',
    allpay_transaction_id: '',
    amount: '',
    instrument_number: '',
    currency: 'GBP',
    payment_type: 1,
    payer_name: '',
    postal_order_type: '',
    sort_code: ''
  };

  constructor(
    private paymentTypeService: PaymenttypeService,
    private userService: UserService,
    private router: Router
  ) { }

  async ngOnInit() {
    if (!this.userService.getUser()) {
      this.router.navigateByUrl('/');
    }

    try {
      const paymentTypes: any = await this.paymentTypeService.getPaymentTypes();
      for (let i = 0; i < paymentTypes.data.length; i++) {
        this.payment_types.push(paymentTypes.data[i]);
      }
    } catch (error) {
      console.log(error)
    }
  }

  async onFormSubmission() {
    const data = this.cleanData();
    try {
      const makePayment: any = await this.paymentTypeService.createPostPayment(data);
      this.resetData();
      this.newDataId = makePayment.data.daily_sequence_id;
      this.showModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  onInputPropertyChange($ev): void {
    // check if all the fields are empty or not
    if (this.hasPopulatedField()) {
      this.filledContent = true;
    } else {
      this.filledContent = false;
    }
  }

  onChangePaymentType(paymentTypeId): void {
    this.filledContent = true;
    this.data.payment_type = paymentTypeId;

    // revert back to initial date except amount and payee name
    this.resetData();
  }

  onToggleShowModal(): void {
    this.showModal = false;
    this.newDataId = 0;
  }

  private hasPopulatedField(): boolean {
    let hasPopulatedField = false;

    for (const property in this.data) {
      if (this.data.hasOwnProperty(property)) {
        if (property === 'currency' || property === 'payment_type') {
          continue;
        }

        if (this.data[property].length > 0) {
          hasPopulatedField = true;
          break;
        }
      }
    }

    return hasPopulatedField;
  }

  private cleanData(): {} {
    const cleanData = {};
    for (const property in this.data) {
      if (
        this.data.hasOwnProperty(property) &&
        this.data[property] !== ''
      ) {
        if (property === 'amount') {
          cleanData[property] = parseFloat(this.data[property]) * 100;
        } else {
          cleanData[property] = this.data[property];
        }
      }
    }

    return cleanData;
  }

  private resetData(): void {
    this.data.account_number = '';
    this.data.allpay_transaction_id = '';
    this.data.amount = '';
    this.data.instrument_number = '';
    this.data.postal_order_type = '';
    this.data.payer_name = '';
    this.data.sort_code = '';
  }
}
