import { TestBed } from '@angular/core/testing';

import { IsAuthenticatedService } from './is-authenticated.service';

describe('IsAuthenticatedService', () => {
  let service: IsAuthenticatedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsAuthenticatedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
