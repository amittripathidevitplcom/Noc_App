import { TestBed } from '@angular/core/testing';

import { HospitalDetailService } from './hospital-detail.service';

describe('HospitalDetailService', () => {
  let service: HospitalDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
