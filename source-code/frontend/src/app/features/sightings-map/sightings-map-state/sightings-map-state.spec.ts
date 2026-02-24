import { TestBed } from '@angular/core/testing';

import { SightingsMapState } from './sightings-map-state';

describe('SightingsMapState', () => {
  let service: SightingsMapState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SightingsMapState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
