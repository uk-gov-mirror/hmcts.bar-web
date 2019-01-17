import { PaymentInstructionModel } from './paymentinstruction.model';

describe('PaymentInstructionModel: ', () => {

  it('test status label when status is code', () => {
    const model = new PaymentInstructionModel();
    model.status = 'PA';
    expect(model.statusLabel).toBe('Pending Review');
  });

  it('test status label when status is already label', () => {
    const model = new PaymentInstructionModel();
    model.status = 'Pending Approval';
    expect(model.statusLabel).toBe('Pending Approval');
  });

  it('test status label when status can not be recognized', () => {
    const model = new PaymentInstructionModel();
    model.status = 'Some new label';
    expect(model.statusLabel).toBe('Some new label');
  });

});
