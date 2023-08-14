import { TestBed } from '@angular/core/testing';

import { AnimalDocumentScrutinyService } from './animal-document-scrutiny.service';

describe('AnimalDocumentScrutinyService', () => {
  let service: AnimalDocumentScrutinyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimalDocumentScrutinyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
