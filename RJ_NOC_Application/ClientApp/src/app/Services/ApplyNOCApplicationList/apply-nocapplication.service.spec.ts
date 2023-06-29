import { TestBed } from '@angular/core/testing';

import { ApplyNOCApplicationService } from '../ApplyNOCApplicationList/apply-nocapplication.service';

describe('ApplyNOCApplicationService', () => {
  let service: ApplyNOCApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplyNOCApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
