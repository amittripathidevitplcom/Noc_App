import { TestBed } from '@angular/core/testing';

import { AddRoleMasterService } from './add-role-master.service';

describe('AddRoleMasterService', () => {
  let service: AddRoleMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddRoleMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
