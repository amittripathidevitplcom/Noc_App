import { TestBed } from '@angular/core/testing';

import { OtherDocumentService } from './other-document.service';

describe('OtherDocumentService', () => {
  let service: OtherDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
