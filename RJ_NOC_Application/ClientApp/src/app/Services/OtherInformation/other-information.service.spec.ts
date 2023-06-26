import { TestBed } from '@angular/core/testing';

import { OtherInformationService } from './other-information.service';

describe('OtherInformationService', () => {
  let service: OtherInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
