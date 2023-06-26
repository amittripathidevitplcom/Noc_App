import { TestBed } from '@angular/core/testing';

import { DraftApplicationListService } from './draft-application-list.service';

describe('DraftApplicationListService', () => {
  let service: DraftApplicationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DraftApplicationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
