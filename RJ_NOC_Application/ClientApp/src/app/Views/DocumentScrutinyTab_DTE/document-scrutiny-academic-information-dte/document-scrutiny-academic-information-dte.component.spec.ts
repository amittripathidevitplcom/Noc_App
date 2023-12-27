import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyAcademicInformationDTEComponent } from './document-scrutiny-academic-information-dte.component';

describe('DocumentScrutinyAcademicInformationDTEComponent', () => {
  let component: DocumentScrutinyAcademicInformationDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyAcademicInformationDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyAcademicInformationDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyAcademicInformationDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
