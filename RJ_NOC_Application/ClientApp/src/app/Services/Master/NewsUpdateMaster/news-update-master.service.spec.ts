import { TestBed } from '@angular/core/testing';

import { NewsUpdateMasterService } from './news-update-master.service';

describe('NewsUpdateMasterService', () => {
  let service: NewsUpdateMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsUpdateMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
