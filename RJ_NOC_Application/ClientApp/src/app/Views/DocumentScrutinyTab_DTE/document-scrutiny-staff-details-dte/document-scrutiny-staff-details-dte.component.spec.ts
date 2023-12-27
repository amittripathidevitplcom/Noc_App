import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyStaffDetailsDTEComponent } from './document-scrutiny-staff-details-dte.component';

describe('DocumentScrutinyStaffDetailsDTEComponent', () => {
  let component: DocumentScrutinyStaffDetailsDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyStaffDetailsDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyStaffDetailsDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyStaffDetailsDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
