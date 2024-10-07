import { TestBed } from '@angular/core/testing';

import { MGoneNOCService } from './mgone-noc.service';

describe('MGoneNOCService', () => {
  let service: MGoneNOCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MGoneNOCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
