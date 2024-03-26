import { TestBed } from '@angular/core/testing';

import { DTEStatisticsStaffService } from './dtestatistics-staff.service';

describe('DTEStatisticsStaffService', () => {
  let service: DTEStatisticsStaffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DTEStatisticsStaffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
