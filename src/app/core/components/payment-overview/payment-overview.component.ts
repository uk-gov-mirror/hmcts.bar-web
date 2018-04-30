import { Component, OnInit } from '@angular/core';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { UserModel } from '../../models/user.model';
import { IResponse } from '../../interfaces';
import { UserService } from '../../../shared/services/user/user.service';
import { PaymentsOverviewService } from '../../services/paymentoverview/paymentsoverview.service';


class OverviewData {
  userFullName: string;
  userId: string;
  userRole: string;
  readyToReview: number;
  validatedPayments: number;

  assign(data) {
    console.log( data );
    this.userFullName = data.bar_user_full_name;
    this.userId = data.bar_user_id;
    this.userRole = data.bar_user_role;
  }
}


@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrls: ['./payment-overview.component.css'],
  providers: [PaymentslogService, PaymentsOverviewService]
})
export class PaymentOverviewComponent implements OnInit {
  openedTab = 2;
  paymentInstructionModels: PaymentInstructionModel[] = [];
  count = {
    validated: 0,
    readyToReview: 0,
    approved: 0,
    transferredToBar: 0
  };

  postClerks = [];
  feeClerks = [];
  seniorFeeClerks = [];
  deliveryManagers = [];

  constructor(
    private userService: UserService,
    private paymentsLogService: PaymentslogService,
    private paymentOverviewService: PaymentsOverviewService
  ) { }

  ngOnInit() {
    // TODO: Have the user type saved as a CONSTANT
    console.log('retrieved user: ' + typeof this.userService.getUser().roles + ', ' + Array.isArray(this.userService.getUser().roles));
    if (this.userService.getUser().type === 'deliverymanager') {
      this.openedTab = 3;
    }

    this.getPendingApprovalPayments();
    this.paymentOverviewService
      .getPaymentsOverview()
      .subscribe(result => this.arrangeOverviewComponent(result));
  }
  get user (): UserModel {
    return this.userService.getUser();
  }

  arrangeOverviewComponent(result) {
    let key;
    for (key in result) {
      if (key === 'bar-post-clerk') {
        this.createPostClerksOverview( result[key] );
      }

      if (key === 'bar-fee-clerk') {
        this.createFeeClerksOverview( result[key] );
      }
    }
  }

  createPostClerksOverview(postClerkData) {
    for (const id in postClerkData) {
      // this.postClerks = postClerkData[id].map(data => {
      //   const model = new OverviewData();
      //   model.assign(data);
      //   return model;
      // });
    }
  }

  createFeeClerksOverview(feeClerksData) {
    const keys = Object.keys(feeClerksData);
    let i;

    for (i = 0; i < keys.length; i++) {
      const model = new OverviewData();
      feeClerksData[keys[i]].forEach(data => {
        model.userFullName = data.bar_user_full_name;
        model.userRole = data.bar_user_role;
        model.userId = data.bar_user_id;
        if (data.payment_instruction_status === PaymentStatus.VALIDATED) {
          model.validatedPayments = data.count_of_payment_instruction;
        }

        if (data.payment_instruction_status === PaymentStatus.PENDINGAPPROVAL) {
          model.readyToReview = data.count_of_payment_instruction;
        }
      });

      this.feeClerks.push(model);
    }

  }

  changeTabs(tabNumber: number) { this.openedTab = tabNumber; }

  getPendingApprovalPayments() {
    this.paymentsLogService.getPaymentsLog(this.userService.getUser(), PaymentStatus.PENDINGAPPROVAL)
      .then((response: IResponse) => {
        if (response.data.length < 1) {
          // throw an error here
          return;
        }

        this.paymentInstructionModels = response.data.map((paymentInstructionModel: PaymentInstructionModel) => {
          const model = new PaymentInstructionModel();
          model.assign(paymentInstructionModel);
          return model;
        });

        // then update the counts
        this.getAllPaymentsForCalculation();
      })
      .catch((err) => console.error(err));
  }

  getAllPaymentsForCalculation() {
    this.paymentsLogService.getPaymentsLog(this.userService.getUser())
      .then((response: IResponse) => {
        if (!response.success) {
          console.error(response.message);
          return;
        }

        const data: PaymentInstructionModel[] = response.data;
        this.count.approved = this.countPaymentInstructionsByStatus(data, 'Approved').length;
        this.count.readyToReview = this.countPaymentInstructionsByStatus(data, 'Pending Approval').length;
        this.count.transferredToBar = this.countPaymentInstructionsByStatus(data, 'Transferred to bar').length;
        this.count.validated = this.countPaymentInstructionsByStatus(data, 'Validated').length;

        // TODO: get payments by action
      })
      .catch((err) => console.error(err));
  }

  private countPaymentInstructionsByStatus (paymentInstructions: PaymentInstructionModel[], status: string): PaymentInstructionModel[] {
    return paymentInstructions.filter(paymentInstructionModel => paymentInstructionModel.status === status);
  }

  private countPaymentInstructionsByActions (paymentInstructions: PaymentInstructionModel[], action: string): PaymentInstructionModel[] {
    return paymentInstructions.filter(paymentInstructionModel => paymentInstructionModel.action === action);
  }

}
