import { TestBed } from '@angular/core/testing';

import { ParamedicalHospitalService } from './paramedical-hospital.service';

describe('ParamedicalHospitalService', () => {
  let service: ParamedicalHospitalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParamedicalHospitalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
