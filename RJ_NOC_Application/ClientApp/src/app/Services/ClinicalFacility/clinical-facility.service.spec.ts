import { TestBed } from '@angular/core/testing';

import { ClinicalFacilityService } from './clinical-facility.service';

describe('ClinicalFacilityService', () => {
  let service: ClinicalFacilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicalFacilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
