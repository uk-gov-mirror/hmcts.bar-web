import { RemissionModel } from './remission.model';

describe('RemissionModel: ', () => {

  it('test status label when status is code', () => {
    const model = new RemissionModel();
    model.status = 'PA';
    expect(model.statusLabel).toBe('Pending Review');
  });

  it('test status label when status is already label', () => {
    const model = new RemissionModel();
    model.status = 'Pending Approval';
    expect(model.statusLabel).toBe('Pending Approval');
  });

  it('test status label when status can not be recognized', () => {
    const model = new RemissionModel();
    model.status = 'Some new label';
    expect(model.statusLabel).toBe('Some new label');
  });

  it('test get properties should throw unimplemnted exception', () => {
    const model = new RemissionModel();
    expect(() => model.getProperty('whatever')).toThrowError('Method not implemented.');
  });

});
