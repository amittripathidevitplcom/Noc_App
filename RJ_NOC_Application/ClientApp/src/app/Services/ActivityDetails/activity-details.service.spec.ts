import { TestBed } from '@angular/core/testing';

import { ActivityDetailsService } from './activity-details.service';

describe('ActivityDetailsService', () => {
  let service: ActivityDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
