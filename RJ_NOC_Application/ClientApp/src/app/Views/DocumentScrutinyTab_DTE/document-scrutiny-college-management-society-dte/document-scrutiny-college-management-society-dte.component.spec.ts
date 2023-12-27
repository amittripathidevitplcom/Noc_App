import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyCollegeManagementSocietyDTEComponent } from './document-scrutiny-college-management-society-dte.component';

describe('DocumentScrutinyCollegeManagementSocietyDTEComponent', () => {
  let component: DocumentScrutinyCollegeManagementSocietyDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyCollegeManagementSocietyDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyCollegeManagementSocietyDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyCollegeManagementSocietyDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
