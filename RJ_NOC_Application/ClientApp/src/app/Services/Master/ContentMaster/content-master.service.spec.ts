import { TestBed } from '@angular/core/testing';

import { ContentMasterService } from './content-master.service';

describe('ContentMasterService', () => {
  let service: ContentMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
