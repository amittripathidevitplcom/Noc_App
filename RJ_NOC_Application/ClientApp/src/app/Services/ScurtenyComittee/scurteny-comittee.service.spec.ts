import { TestBed } from '@angular/core/testing';

import { ScurtenyComitteeService } from './scurteny-comittee.service';

describe('ScurtenyComitteeService', () => {
  let service: ScurtenyComitteeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScurtenyComitteeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
