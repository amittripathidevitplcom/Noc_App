import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExcelDataComponent } from './import-excel-data.component';

describe('ImportExcelDataComponent', () => {
  let component: ImportExcelDataComponent;
  let fixture: ComponentFixture<ImportExcelDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportExcelDataComponent]
    });
    fixture = TestBed.createComponent(ImportExcelDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
