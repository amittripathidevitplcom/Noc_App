import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MGOneDocumentScrutinyNodalOfficerComponent } from './mgone-document-scrutiny-nodal-officer.component';

describe('MGOneDocumentScrutinyNodalOfficerComponent', () => {
  let component: MGOneDocumentScrutinyNodalOfficerComponent;
  let fixture: ComponentFixture<MGOneDocumentScrutinyNodalOfficerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MGOneDocumentScrutinyNodalOfficerComponent]
    });
    fixture = TestBed.createComponent(MGOneDocumentScrutinyNodalOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
