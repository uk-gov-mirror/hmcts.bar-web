import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { DatePipe } from '@angular/common';
import { NavigationTrackerService } from '../../services/navigationtracker/navigation-tracker.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { NavigationModel } from './navigation.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SearchService } from '../../services/search/search.service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { UtilService } from '../../services/util/util.service';
import { PaymentstateService } from '../../state/paymentstate.service';
import { SearchModel } from '../../models/search.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  providers: [PaymentslogService, PaymenttypeService],
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  model: NavigationModel = new NavigationModel();
  searchModel: SearchModel = new SearchModel();
  todaysDate = Date.now();
  name = '';
  advancedSearchedOpen = false;
  dateSearchModel = new SearchModel();

  constructor(
    private userService: UserService,
    private navigationTrackerService: NavigationTrackerService,
    private paymentslogService: PaymentslogService,
    private paymentTypeService: PaymenttypeService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private paymentState: PaymentstateService) {}

  async ngOnInit() {
    this.searchModel.action = 'All';
    this.searchModel.paymentType = 'All';
    this.searchModel.status = 'D';

    const [err, data] = await UtilService.toAsync(this.paymentTypeService.getPaymentTypes());
    if (!err) {
      this.paymentState.setSharedPaymentTypes(data.data);
    }
  }

  get navigationClass() {
    return this.navigationTrackerService.barColor;
  }

  get user() {
    return this.userService.getUser();
  }

  get paymentTypes() {
    return this.paymentState.state.paymentTypes;
  }

  get searchResults() {
    return this.searchService.paymentLogs;
  }

  onSubmit($ev) {
    $ev.preventDefault();

    if ($ev.which && $ev.which === 13) {
      this.performQuerySearch();
    }
  }

  onClick() {
    this.performQuerySearch();
  }

  async performQuerySearch() {
    const [err, result] = await UtilService.toAsync(this.paymentslogService.searchPaymentsByDate(this.searchModel));
    if (!err) {
      this.searchService.populatePaymentLogs( result.data );
    }

    this.searchModel.caseReference = '';
  }

  logout() {
    this.userService.logOut();
    this.router.navigateByUrl('/');
  }

  openAdvancedSearch() {
    this.advancedSearchedOpen = !this.advancedSearchedOpen;
  }

  async performQueryByDate($event) {
    $event.preventDefault();
    const [err, result] = await UtilService.toAsync(this.paymentslogService.searchPaymentsByDate(this.searchModel));
    if (!err) {
      this.searchService.populatePaymentLogs( result.data );
    }
  }

}
