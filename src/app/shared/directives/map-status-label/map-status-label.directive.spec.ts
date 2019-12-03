import { MapStatusLabelDirective } from './map-status-label.directive';
import { ElementRef } from '@angular/core';

describe('MapStatusLabelDirective', () => {

  it('replace text in the html elment', () => {
    const nativeElement = {
      innerText: 'Transferred to bar Pending Approval Approved',
      addEventListener: () => {}
    };
    const element = new ElementRef(nativeElement);
    // tslint:disable-next-line: no-unused-expression
    new MapStatusLabelDirective(element);
    expect(nativeElement.innerText).toBe('Pending Approval Pending Review Approved');
  });

});
