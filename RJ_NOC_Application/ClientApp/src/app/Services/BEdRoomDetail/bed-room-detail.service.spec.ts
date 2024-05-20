import { TestBed } from '@angular/core/testing';

import { BedRoomDetailService } from './bed-room-detail.service';

describe('BedRoomDetailService', () => {
  let service: BedRoomDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BedRoomDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
