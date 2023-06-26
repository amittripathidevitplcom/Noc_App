import { TestBed } from '@angular/core/testing';

import { HostelDetailsService } from './hostel-details.service';

describe('HostelDetailsService', () => {
  let service: HostelDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostelDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
