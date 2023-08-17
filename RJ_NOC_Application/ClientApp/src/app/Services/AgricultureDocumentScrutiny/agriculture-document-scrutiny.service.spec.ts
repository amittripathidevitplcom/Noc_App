import { TestBed } from '@angular/core/testing';

import { AgricultureDocumentScrutinyService } from './agriculture-document-scrutiny.service';

describe('AgricultureDocumentScrutinyService', () => {
  let service: AgricultureDocumentScrutinyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgricultureDocumentScrutinyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
