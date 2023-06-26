import { TestBed } from '@angular/core/testing';

import { QualificationMasterPageService } from './../QualificationMaster/qualification-masterpage.service';

describe('QualificationMasterPageService', () => {
  let service: QualificationMasterPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualificationMasterPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
