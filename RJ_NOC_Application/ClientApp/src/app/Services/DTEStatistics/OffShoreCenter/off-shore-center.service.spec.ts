import { TestBed } from '@angular/core/testing';

import { OffShoreCenterService } from './off-shore-center.service';

describe('OffShoreCenterService', () => {
  let service: OffShoreCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffShoreCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
