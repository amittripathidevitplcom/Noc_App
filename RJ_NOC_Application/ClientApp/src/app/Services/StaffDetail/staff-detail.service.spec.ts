import { TestBed } from '@angular/core/testing';

import { StaffDetailService } from './staff-detail.service';

describe('StaffDetailService', () => {
  let service: StaffDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
