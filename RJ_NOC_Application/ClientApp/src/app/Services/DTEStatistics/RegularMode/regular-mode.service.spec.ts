import { TestBed } from '@angular/core/testing';

import { RegularModeService } from './regular-mode.service';

describe('RegularModeService', () => {
  let service: RegularModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegularModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
