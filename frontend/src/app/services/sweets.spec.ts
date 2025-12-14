import { TestBed } from '@angular/core/testing';

import { Sweets } from './sweets';

describe('Sweets', () => {
  let service: Sweets;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sweets);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
