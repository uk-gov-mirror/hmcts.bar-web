import { TestBed, inject } from '@angular/core/testing';

import { PaymentstateService } from './paymentstate.service';
import { IPaymentType } from '../../../core/interfaces/payment-types';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { BarHttpClientMock } from '../../../core/test-mocks/bar.http.client.mock';
import { mock, instance } from 'ts-mockito';
import { Observable } from 'rxjs/Observable';

describe('PaymentstateService', () => {
  let paymentStateService: PaymentstateService;
  let barHttpClient: BarHttpClient;

  const paymentType: IPaymentType = { id: 'cash', name: 'Cash' };
  const paymentTypeArray: IPaymentType[] = [];
  paymentTypeArray.push( paymentType );

  beforeEach(() => {
    barHttpClient = instance(mock(BarHttpClient));
    spyOn(barHttpClient, 'get').and.callFake(url => {
      return new Observable(observer => {
        observer.next(paymentTypeArray);
        observer.complete();
      });
    });
    paymentStateService = new PaymentstateService(barHttpClient);
  });

  it('Should reflect the default currentOpenedFeeTab to be "1".', () => {
      expect(paymentStateService.currentOpenedFeeTab).toEqual(1);
  });

  it('Should reflect the change to the default current opened fee tab.', () => {
      const feeTab = 5;
      paymentStateService.setCurrentOpenedFeeTab( feeTab );
      expect(paymentStateService.currentOpenedFeeTab).toEqual( feeTab );
    });

  it('Should reflect the change to the currentOpenedFeeTab.', () => {
      const currentOpenedFeeTab = 3;
      paymentStateService.setCurrentOpenedFeeTab( currentOpenedFeeTab );
      expect(paymentStateService.currentOpenedFeeTab).toEqual( currentOpenedFeeTab );
    });

  it('The number of items in an array should change once I have added one.', async () => {
      const retrievedTypes = await paymentStateService.paymentTypes;
      expect(retrievedTypes.length).toBe(1);
    });
});
