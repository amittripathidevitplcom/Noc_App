import { TestBed } from '@angular/core/testing';

import { BEDApplicationEntryService } from './bedapplication-entry.service';

describe('BEDApplicationEntryService', () => {
  let service: BEDApplicationEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BEDApplicationEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
