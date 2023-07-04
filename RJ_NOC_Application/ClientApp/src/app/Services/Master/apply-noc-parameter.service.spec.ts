import { TestBed } from '@angular/core/testing';

import { ApplyNocParameterService } from './apply-noc-parameter.service';

describe('ApplyNocParameterService', () => {
  let service: ApplyNocParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplyNocParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
