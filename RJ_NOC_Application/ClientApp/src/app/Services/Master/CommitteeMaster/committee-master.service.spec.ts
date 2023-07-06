import { TestBed } from '@angular/core/testing';

import { CommitteeMasterService } from './committee-master.service';

describe('CommitteeMasterService', () => {
  let service: CommitteeMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommitteeMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
