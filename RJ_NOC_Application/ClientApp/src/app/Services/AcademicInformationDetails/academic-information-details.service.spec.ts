import { TestBed } from '@angular/core/testing';

import { AcademicInformationDetailsService } from './academic-information-details.service';

describe('AcademicInformationDetailsService', () => {
  let service: AcademicInformationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicInformationDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
