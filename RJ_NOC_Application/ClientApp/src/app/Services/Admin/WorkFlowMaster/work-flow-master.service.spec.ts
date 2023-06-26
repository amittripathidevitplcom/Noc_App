import { TestBed } from '@angular/core/testing';

import { WorkFlowMasterService } from './work-flow-master.service';

describe('WorkFlowMasterService', () => {
  let service: WorkFlowMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkFlowMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
