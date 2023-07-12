import { TestBed } from '@angular/core/testing';

import { RNCCheckListMasterService } from './rnccheck-list-master.service';

describe('RNCCheckListMasterService', () => {
  let service: RNCCheckListMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RNCCheckListMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
