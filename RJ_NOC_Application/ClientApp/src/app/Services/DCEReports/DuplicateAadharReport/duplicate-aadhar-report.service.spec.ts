import { TestBed } from '@angular/core/testing';

import { DuplicateAadharReportService } from './duplicate-aadhar-report.service';

describe('DuplicateAadharReportService', () => {
  let service: DuplicateAadharReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DuplicateAadharReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
