import { TestBed } from '@angular/core/testing';

import { DTEDocumentScrutinyService } from './dtedocument-scrutiny.service';

describe('DCEDocumentScrutinyService', () => {
  let service: DTEDocumentScrutinyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DTEDocumentScrutinyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
