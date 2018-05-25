import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PaymentslogComponent } from './paymentslog.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, RouterModule, RouterLinkWithHref } from '@angular/router';

import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { UpperCaseFirstPipe } from '../../pipes/upper-case-first.pipe';

import { NumbersOnlyDirective } from '../../directives/numbers-only.directive';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../test-mocks/payment-type.service.mock';
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';
import { UserServiceMock } from '../../test-mocks/user.service.mock';
import { CardComponent } from '../../../shared/components/card/card.component';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { PaymentStatus } from '../../models/paymentstatus.model';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { createPaymentInstruction, getPaymentInstructionList } from '../../../test-utils/test-utils';

describe('PaymentslogComponent', () => {
  let component: PaymentslogComponent;
  let fixture: ComponentFixture<PaymentslogComponent>;

  class MockRouter {
    get url() {
      return '/change-payment';
    }
    navigateByUrl(url: string) { return url; }
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ CardComponent, PaymentslogComponent, UpperCaseFirstPipe, NumbersOnlyDirective ],
    }).overrideComponent(PaymentslogComponent, {
      set: {
        providers: [
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: UserService, useClass: UserServiceMock },
          { provide: Router, useClass: MockRouter }
        ]
      }
    });
    fixture = TestBed.createComponent(PaymentslogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ensure payment instruction has toggled "checked" status.', () => {
    const paymentInstruction: IPaymentsLog = new PaymentInstructionModel();
    paymentInstruction.amount = 23999;
    paymentInstruction.currency = 'GBP';
    paymentInstruction.daily_sequence_id = 31;
    paymentInstruction.payer_name = 'Mike Brown';
    paymentInstruction.payment_date = new Date();
    paymentInstruction.payment_type = { id: 'cash', name: 'Cash' };
    paymentInstruction.status = PaymentStatus.PENDING;
    component.onAlterCheckedState(paymentInstruction);
    expect(paymentInstruction.selected).toBeTruthy();
  });

  it('should check and ensure that payments have disappeared.', () => {
    fixture.whenStable().then(() => {
      const paymentInstructions = component.payments_logs.map(paymentInstruction => paymentInstruction.selected = true);
      component.onFormSubmission();
      fixture.detectChanges();
      expect(paymentInstructions.length).toEqual(0);
      expect(component.selectAllPosts).toBeFalsy();
    });
  });

  it('should check and ensure that payments have disappeared.', () => {
    fixture.whenStable().then(() => {
      const paymentInstructions = component.payments_logs.map(paymentInstruction => paymentInstruction.selected = true);
      component.onFormSubmissionDelete();
      fixture.detectChanges();
      expect(paymentInstructions.length).toEqual(0);
      expect(component.selectAllPosts).toBeFalsy();
    });
  });

  it('should ensure that when toggle all posts works.', () => {
    fixture.whenStable().then(() => {
      component.onSelectAllPosts();
      fixture.detectChanges();
      expect(component.payments_logs.filter(payment => payment.selected).length).toEqual(component.payments_logs.length);
    });
  });

});
