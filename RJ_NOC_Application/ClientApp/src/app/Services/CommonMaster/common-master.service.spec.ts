import { TestBed } from '@angular/core/testing';

import { CommonMasterService } from './common-master.service';

describe('CommonMasterService', () => {
  let service: CommonMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
