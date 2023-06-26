import { TestBed } from '@angular/core/testing';

import { FacilityDetailsService } from './facility-details.service';

describe('FacilityDetailsService', () => {
  let service: FacilityDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacilityDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
