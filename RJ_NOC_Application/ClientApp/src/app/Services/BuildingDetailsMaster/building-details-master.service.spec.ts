import { TestBed } from '@angular/core/testing';

import { BuildingDetailsMasterService } from './building-details-master.service';

describe('BuildingDetailsMasterService', () => {
  let service: BuildingDetailsMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingDetailsMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
