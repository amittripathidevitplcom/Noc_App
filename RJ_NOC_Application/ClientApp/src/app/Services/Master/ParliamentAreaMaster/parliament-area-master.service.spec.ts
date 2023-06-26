import { TestBed } from '@angular/core/testing';

import { ParliamentAreaMasterService } from './parliament-area-master.service';

describe('ParliamentAreaMasterService', () => {
  let service: ParliamentAreaMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParliamentAreaMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
