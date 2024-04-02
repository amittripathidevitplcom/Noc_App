import { TestBed } from '@angular/core/testing';

import { OtherMinorityDataService } from './other-minority-data.service';

describe('OtherMinorityDataService', () => {
  let service: OtherMinorityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherMinorityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
