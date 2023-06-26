import { TestBed } from '@angular/core/testing';

import { SocityService } from './socity.service';

describe('SocityService', () => {
  let service: SocityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
