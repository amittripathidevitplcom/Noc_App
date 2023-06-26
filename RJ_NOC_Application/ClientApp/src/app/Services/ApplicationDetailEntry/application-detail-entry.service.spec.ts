import { TestBed } from '@angular/core/testing';

import { ApplicationDetailEntryService } from './application-detail-entry.service';

describe('ApplicationDetailEntryService', () => {
  let service: ApplicationDetailEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationDetailEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
