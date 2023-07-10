import { TestBed } from '@angular/core/testing';

import { MedicalDocumentScrutinyService } from './medical-document-scrutiny.service';

describe('MedicalDocumentScrutinyService', () => {
  let service: MedicalDocumentScrutinyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalDocumentScrutinyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
