import { TestBed } from '@angular/core/testing';

import { DTEStatisticsDepartmentService } from './dtestatistics-department.service';

describe('DTEStatisticsDepartmentService', () => {
  let service: DTEStatisticsDepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DTEStatisticsDepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
