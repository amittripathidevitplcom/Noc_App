import { TestBed } from '@angular/core/testing';

import { ResidentialFacilityService } from './residential-facility.service';

describe('ResidentialFacilityService', () => {
  let service: ResidentialFacilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResidentialFacilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
