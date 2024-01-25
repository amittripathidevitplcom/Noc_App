import { TestBed } from '@angular/core/testing';

import { UserManualDocumentService } from './user-manual-document.service';

describe('UserManualDocumentService', () => {
  let service: UserManualDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManualDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
