import { TestBed } from '@angular/core/testing';

import { SteramMasterService } from './steram-master.service';

describe('SteramMasterService', () => {
  let service: SteramMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SteramMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
