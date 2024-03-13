import { TestBed } from '@angular/core/testing';

import { OfficersDetailsService } from './officers-details.service';

describe('OfficersDetailsService', () => {
  let service: OfficersDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficersDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
