import { TestBed } from '@angular/core/testing';

import { HttpRequester } from './http-requester';

describe('HttpRequester', () => {
  let service: HttpRequester;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpRequester);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
