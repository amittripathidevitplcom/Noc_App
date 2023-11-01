import { TestBed } from '@angular/core/testing';

import { NocInformationService } from './noc-information.service';

describe('NocInformationService', () => {
  let service: NocInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NocInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
