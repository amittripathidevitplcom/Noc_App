import { TestBed } from '@angular/core/testing';

import { StudentEnrollmentDistanceModeService } from './student-enrollment-distance-mode.service';

describe('StudentEnrollmentDistanceModeService', () => {
  let service: StudentEnrollmentDistanceModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentEnrollmentDistanceModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
