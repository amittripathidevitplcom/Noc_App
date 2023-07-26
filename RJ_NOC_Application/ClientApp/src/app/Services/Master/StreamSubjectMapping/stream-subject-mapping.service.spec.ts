import { TestBed } from '@angular/core/testing';

import { SteramSubjectMappingService } from './stream-subject-mapping.service';

describe('SteramSubjectMappingService', () => {
  let service: SteramSubjectMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SteramSubjectMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
