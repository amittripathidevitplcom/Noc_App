import { TestBed } from '@angular/core/testing';

import { LandDetailsService } from './../LandDetails/land-details.service';

describe('LandDetailsService', () => {
  let service: LandDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
