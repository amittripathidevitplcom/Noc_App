import { TestBed } from '@angular/core/testing';

import { ExaminationResultsRegularService } from './examination-results-regular.service';

describe('ExaminationResultsRegularService', () => {
  let service: ExaminationResultsRegularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExaminationResultsRegularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
