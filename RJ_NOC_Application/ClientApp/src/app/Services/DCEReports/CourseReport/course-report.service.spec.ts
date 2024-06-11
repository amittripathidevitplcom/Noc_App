import { TestBed } from '@angular/core/testing';

import { CourseReportService } from './course-report.service';

describe('CourseReportService', () => {
  let service: CourseReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
