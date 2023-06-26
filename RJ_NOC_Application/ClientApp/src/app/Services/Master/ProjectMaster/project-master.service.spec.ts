import { TestBed } from '@angular/core/testing';

import { ProjectMasterService } from './project-master.service';

describe('ProjectMasterService', () => {
  let service: ProjectMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
