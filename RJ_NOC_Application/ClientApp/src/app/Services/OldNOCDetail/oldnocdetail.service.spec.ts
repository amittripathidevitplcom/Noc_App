import { TestBed } from '@angular/core/testing';

import { OldnocdetailService } from './oldnocdetail.service';

describe('OldnocdetailService', () => {
  let service: OldnocdetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OldnocdetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
