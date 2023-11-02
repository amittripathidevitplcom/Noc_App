import { TestBed } from '@angular/core/testing';

import { LOIFeemasterService } from './loifeemaster.service';

describe('LOIFeemasterService', () => {
  let service: LOIFeemasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LOIFeemasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
