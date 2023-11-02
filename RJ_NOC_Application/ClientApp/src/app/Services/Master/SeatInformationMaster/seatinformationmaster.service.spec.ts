import { TestBed } from '@angular/core/testing';

import { SeatInformationmasterService } from './seatinformationmaster.service';

describe('SeatInformationmasterService', () => {
  let service: SeatInformationmasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeatInformationmasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
