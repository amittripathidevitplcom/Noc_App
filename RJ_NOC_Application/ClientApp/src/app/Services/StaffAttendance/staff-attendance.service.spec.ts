import { TestBed } from '@angular/core/testing';

import { StaffAttendanceService } from './staff-attendance.service';

describe('StaffAttendanceService', () => {
  let service: StaffAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
