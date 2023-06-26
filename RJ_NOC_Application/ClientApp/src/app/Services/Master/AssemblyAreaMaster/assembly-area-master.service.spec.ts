import { TestBed } from '@angular/core/testing';

import { AssemblyAreaMasterService } from './assembly-area-master.service';

describe('AssemblyAreaMasterService', () => {
  let service: AssemblyAreaMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssemblyAreaMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
