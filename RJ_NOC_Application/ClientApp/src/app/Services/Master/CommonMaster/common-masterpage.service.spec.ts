import { TestBed } from '@angular/core/testing';

import { CommonMasterPageService } from './../CommonMaster/common-masterpage.service';

describe('CommonMasterPageService', () => {
  let service: CommonMasterPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonMasterPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
