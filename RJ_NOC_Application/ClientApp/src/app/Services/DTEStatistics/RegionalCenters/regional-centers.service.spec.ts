import { TestBed } from '@angular/core/testing';

import { RegionalCentersService } from './regional-centers.service';

describe('RegionalCentersService', () => {
  let service: RegionalCentersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionalCentersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
