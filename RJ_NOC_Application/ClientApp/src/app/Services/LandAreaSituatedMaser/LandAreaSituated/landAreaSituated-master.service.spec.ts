import { TestBed } from '@angular/core/testing';

import { LandAreaSituatedMasterService } from './LandAreaSituated-master.service';

describe('LandAreaSituatedMasterService', () => {
  let service: LandAreaSituatedMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandAreaSituatedMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
