import { TestBed } from '@angular/core/testing';

import { ScholarshipFellowshipLoanAccService } from './scholarship-fellowship-loan-acc.service';

describe('ScholarshipFellowshipLoanAccService', () => {
  let service: ScholarshipFellowshipLoanAccService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScholarshipFellowshipLoanAccService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
