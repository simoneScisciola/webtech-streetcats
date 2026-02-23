import { TestBed } from '@angular/core/testing';

import { ObservableToast } from './observable-toast';

describe('ObservableToast', () => {
  let service: ObservableToast;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObservableToast);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
