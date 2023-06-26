import { TestBed } from '@angular/core/testing';

import { TrusteeGeneralInfoService } from './trustee-general-info.service';

describe('TrusteeGeneralInfoService', () => {
  let service: TrusteeGeneralInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrusteeGeneralInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
