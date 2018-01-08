import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FeeLogModel } from '../../models/feelog.model';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-feelogedit',
  templateUrl: './feelogedit.component.html',
  providers: [PaymentslogService],
  styleUrls: ['./feelogedit.component.css']
})
export class FeelogeditComponent implements OnInit {
  loadedId: string;
  model: FeeLogModel = new FeeLogModel();
  modalOn = false;
  caseNumberModel = '';
  openedTab = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private paymentLogService: PaymentslogService,
    private location: Location) { }

  ngOnInit() {
    if (!this.userService.getUser()) {
      return this.router.navigateByUrl('/');
    }

    this.route.params.subscribe(params => {
      if (typeof params.id !== 'undefined') {
        this.loadedId = params.id;
        if (/[0-9]/.test(this.loadedId)) {
          this.loadFeeById(this.loadedId);
        } else {
          this.router.navigateByUrl('/paymentslog');
        }
      }
    });
  }

  async loadFeeById(feeId) {
    try {
      const request = await this.paymentLogService.getPaymentById( feeId );
      if (request.success === true) {
        this.model = request.data;
        if (this.model.case_references.length > 0) {
          this.caseNumberModel = this.model.case_references[0].case_reference;
        }
      }
    } catch (e) {
      console.log( e );
    }
  }

  async addCaseReference($event) {
    $event.preventDefault();
    try {
      if (this.model.case_references.length < 1) {
        const createCaseNumber = await this.paymentLogService.createCaseNumber( this.model.id, { case_reference: this.caseNumberModel });
        if (createCaseNumber.success === true) {
          this.model = createCaseNumber.data;
          this.toggleCaseModalWindow();
        }
      }
    } catch (exception) {
      console.log( exception );
    }
  }

  goBack() {
    this.location.back();
  }

  changeTabs(openedTab: number) {
    this.openedTab = openedTab;
  }

  toggleCaseModalWindow(): void {
    this.modalOn = !this.modalOn;
  }

}
