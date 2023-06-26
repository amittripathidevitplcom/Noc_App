import { TestBed } from '@angular/core/testing';

import { SSOLoginService } from './ssologin.service';

describe('SSOLoginService', () => {
  let service: SSOLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SSOLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
