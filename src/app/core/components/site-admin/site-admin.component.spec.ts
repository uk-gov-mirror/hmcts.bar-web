import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SiteAdminComponent } from './site-admin.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SitesService } from '../../../shared/services/sites/sites.service';
import { SitesServiceMock } from '../../test-mocks/sites.service.mock';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HmctsModalComponent } from '../../../shared/components/hmcts-modal/hmcts-modal.component';
import { UserService } from '../../../shared/services/user/user.service';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import { BarHttpClientMock } from '../../test-mocks/bar.http.client.mock';
import { UserServiceMock } from '../../test-mocks/user.service.mock';
import { FeatureService } from '../../../shared/services/feature/feature.service';
import { of } from 'rxjs';

describe('SiteAdminComponent', () => {

  let component: SiteAdminComponent;
  let fixture: ComponentFixture<SiteAdminComponent>;
  let siteService: SitesService;
  let barHttpClient: BarHttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]), FormsModule ],
      declarations: [SiteAdminComponent, HmctsModalComponent],
      providers: [CookieService, UserService]
    }).overrideComponent(SiteAdminComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: UserServiceMock },
          { provide: CookieService, useValue: {get: () => 'create-user', set: () => {}}},
          { provide: SitesService, useClass: SitesServiceMock },
          { provide: BarHttpClient, useClass: BarHttpClientMock},
          { provide: FeatureService, useValue: {
            findAllFeatures: () => of([{uid: 'register-user-idam', enable: true}])
          }}
        ]
      }
    });
    fixture = TestBed.createComponent(SiteAdminComponent);
    component = fixture.componentInstance;
    siteService = fixture.debugElement.injector.get(SitesService);
    barHttpClient = fixture.debugElement.injector.get(BarHttpClient);
    spyOn(component, 'ngOnInit').and.callThrough();
    fixture.detectChanges();
  });

  it('should test nginit', async() => {
    let calledWithParam1;
    const scope = 'true';
    const isFeatureOn = true;
    spyOn(barHttpClient, 'get').and.callFake(param => {
      calledWithParam1 = param;
      return of({ data: [], success: true });
    });
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(isFeatureOn).toBeTruthy();
    expect(scope).not.toBeUndefined();
    expect(barHttpClient.get).toHaveBeenCalled();
    expect(calledWithParam1).toEqual('/api/invalidate-token');
  });

  it('should display emails assigned to site', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.users$.subscribe(emails => {
      expect(emails.length).toBe(3);
    });
  });

  it('clicking on add user button shows the form', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    const addUserBtn = fixture.debugElement.query(By.css('#add-user-modal')).nativeElement;
    addUserBtn.click();
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Add new user');
  });

  it('test cancelling form', () => {
    const addUserBtn = fixture.debugElement.query(By.css('#add-user-modal')).nativeElement;
    addUserBtn.click();
    fixture.detectChanges();
    let h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Add new user');
    const cancelBtn = fixture.debugElement.query(By.css('#cancel-add-user')).nativeElement;
    cancelBtn.click();
    fixture.detectChanges();
    h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Users from Bromley County Court');
  });

  it('test submitting the form', () => {
    spyOn(component, 'onFormSubmission').and.callThrough();
    const addUserBtn = fixture.debugElement.query(By.css('#add-user-modal')).nativeElement;
    addUserBtn.click();
    fixture.detectChanges();
    let h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Add new user');
    const submitBtn = fixture.debugElement.query(By.css('#cancel-add-user')).nativeElement;
    submitBtn.click();
    fixture.detectChanges();
    h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Users from Bromley County Court');
    expect(component.onFormSubmission).toHaveBeenCalledTimes(1);
  });

  it('test remove user from site', async() => {
    spyOn(siteService, 'removeUserFromSite').and.callThrough();
    await fixture.whenStable();
    fixture.detectChanges();
    const modal = fixture.nativeElement.querySelector('#delete-confirmation-dialog');
    expect(modal.hidden).toBeTruthy();
    const delBtn = fixture.nativeElement.querySelector('a#del-1');
    delBtn.click();
    fixture.detectChanges();
    expect(modal.hidden).toBeFalsy();
    expect(component.deleteConfirmationOn).toBeTruthy();
    expect(component.emailToDelete).toBe('b@b.com');
    const modalCancelBtn = fixture.nativeElement.querySelector('a#cancel-delete-btn');
    modalCancelBtn.click();
    fixture.detectChanges();
    expect(modal.hidden).toBeTruthy();
    expect(component.deleteConfirmationOn).toBeFalsy();
    delBtn.click();
    fixture.detectChanges();
    const submitBtn = fixture.nativeElement.querySelector('#submit-delete-btn');
    submitBtn.click();
    fixture.detectChanges();
    expect(modal.hidden).toBeTruthy();
    expect(siteService.removeUserFromSite).toHaveBeenCalledTimes(1);
  });

});
