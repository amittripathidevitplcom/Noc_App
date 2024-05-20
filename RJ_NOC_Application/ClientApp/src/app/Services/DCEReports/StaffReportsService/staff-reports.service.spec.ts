import { TestBed } from '@angular/core/testing';

import { StaffReportsService } from './staff-reports.service';

describe('StaffReportsService', () => {
  let service: StaffReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
