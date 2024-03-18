import { TestBed } from '@angular/core/testing';

import { PlacementDetailsService } from './placement-details.service';

describe('PlacementDetailsService', () => {
  let service: PlacementDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
