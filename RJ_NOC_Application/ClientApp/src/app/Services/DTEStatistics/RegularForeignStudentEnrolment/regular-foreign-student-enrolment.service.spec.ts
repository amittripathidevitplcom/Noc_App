import { TestBed } from '@angular/core/testing';

import { RegularForeignStudentEnrolmentService } from './regular-foreign-student-enrolment.service';

describe('RegularForeignStudentEnrolmentService', () => {
  let service: RegularForeignStudentEnrolmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegularForeignStudentEnrolmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
