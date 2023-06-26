import { TestBed } from '@angular/core/testing';

import { CollegeDocumentService } from './college-document.service';

describe('CollegeDocumentService', () => {
  let service: CollegeDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollegeDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
