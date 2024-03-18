import { TestBed } from '@angular/core/testing';

import { FinancialDetailsService } from './financial-details.service';

describe('FinancialDetailsService', () => {
  let service: FinancialDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
