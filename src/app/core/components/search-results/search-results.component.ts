import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IPaymentsLog } from '../../interfaces/payments-log';
import { PaymentstateService } from '../../../shared/services/state/paymentstate.service';
import { PaymentTypeEnum } from '../../models/payment.type.enum';
import { BaseComponent } from '../../../shared/components/base.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  providers: [SearchService],
})
export class SearchResultsComponent extends BaseComponent implements OnInit {

  paymentTypeEnum = new PaymentTypeEnum();

  constructor(
    private _searchService: SearchService,
    paymentStateService: PaymentstateService
  ) {
    super(paymentStateService);
  }

  get paymentInstructions$(): BehaviorSubject<IPaymentsLog[]> {
    return this._searchService.paymentInstructions$;
  }

}
