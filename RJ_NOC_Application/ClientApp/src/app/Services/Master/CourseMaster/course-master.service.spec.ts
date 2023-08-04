import { TestBed } from '@angular/core/testing';

import { CourseMasterService } from './course-master.service';

describe('CourseMasterService', () => {
  let service: CourseMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
