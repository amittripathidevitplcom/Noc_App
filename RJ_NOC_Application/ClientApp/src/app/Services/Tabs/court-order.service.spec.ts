import { TestBed } from '@angular/core/testing';

import { CourtOrderService } from './court-order.service';

describe('CourtOrderService', () => {
  let service: CourtOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourtOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
