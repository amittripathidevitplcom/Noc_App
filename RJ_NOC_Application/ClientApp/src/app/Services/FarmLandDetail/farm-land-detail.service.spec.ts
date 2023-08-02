import { TestBed } from '@angular/core/testing';

import { FarmLandDetailService } from './farm-land-detail.service';

describe('FarmLandDetailService', () => {
  let service: FarmLandDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FarmLandDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
