import { TestBed } from '@angular/core/testing';

import { OtherInformationMasterServiceService } from './other-information-master-service.service';

describe('OtherInformationMasterServiceService', () => {
  let service: OtherInformationMasterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherInformationMasterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
