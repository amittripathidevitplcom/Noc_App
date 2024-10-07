import { TestBed } from '@angular/core/testing';

import { DentalChairsMGOneNOCService } from './dental-chairs-mgone-noc.service';

describe('DentalChairsMGOneNOCService', () => {
  let service: DentalChairsMGOneNOCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DentalChairsMGOneNOCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
