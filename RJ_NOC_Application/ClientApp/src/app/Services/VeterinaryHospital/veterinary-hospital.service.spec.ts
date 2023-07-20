import { TestBed } from '@angular/core/testing';

import { VeterinaryHospitalService } from './veterinary-hospital.service';

describe('VeterinaryHospitalService', () => {
  let service: VeterinaryHospitalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VeterinaryHospitalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
