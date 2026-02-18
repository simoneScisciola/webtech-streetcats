import { TestBed } from '@angular/core/testing';

import { Sightings } from './sightings';

describe('Sightings', () => {
  let service: Sightings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sightings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
