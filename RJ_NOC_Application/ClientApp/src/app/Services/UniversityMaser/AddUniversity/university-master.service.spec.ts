import { TestBed } from '@angular/core/testing';

import { UniversityMasterService } from './university-master.service';

describe('UniversityMasterService', () => {
  let service: UniversityMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniversityMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
