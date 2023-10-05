import { TestBed } from '@angular/core/testing';

import { ImportExcelDataService } from './import-excel-data.service';

describe('ImportExcelDataService', () => {
  let service: ImportExcelDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportExcelDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
