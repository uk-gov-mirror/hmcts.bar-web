import { TestBed, inject } from '@angular/core/testing';

import { UtilService } from './util.service';
import { createPaymentInstruction } from '../../../test-utils/test-utils';
import { PaymentStatus } from '../../../core/models/paymentstatus.model';

describe('UtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService]
    });
  });

  it('should be created', inject([UtilService], (service: UtilService) => {
    expect(service).toBeTruthy();
  }));

  it('should correctly convert to uppercase / capitalize.', () => {
    const name = 'damien johnson';
    expect(UtilService.convertToUpperCase(name)).toBe('Damien Johnson');
  });

  it('should return false', () => {
    const model = createPaymentInstruction();
    expect(UtilService.checkIfReadOnly(model)).toBeFalsy();
  });

  it('should return true', () => {
    const model = createPaymentInstruction();
    model.status = PaymentStatus.getPayment('Validated').code;
    expect(UtilService.checkIfReadOnly(model)).toBeTruthy();
  });

  it('should return an error as expected (from the promise).', async () => {
    const promise = new Promise((resolve, reject) =>
      reject(new Error('Something went wrong.'))
    );
    const [err, data] = await UtilService.toAsync(promise);
    expect(err).toBeTruthy();
  });
});
