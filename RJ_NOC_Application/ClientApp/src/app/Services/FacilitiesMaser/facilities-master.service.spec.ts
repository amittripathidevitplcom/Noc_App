import { TestBed } from '@angular/core/testing';

import { FacilitiesMaserService } from './facilities-master.service';

describe('FacilitiesMaserService', () => {
  let service: FacilitiesMaserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacilitiesMaserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
