import { TestBed } from '@angular/core/testing';

import { DCEDocumentScrutinyService } from './dcedocument-scrutiny.service';

describe('DCEDocumentScrutinyService', () => {
  let service: DCEDocumentScrutinyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DCEDocumentScrutinyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
