import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyStepIIApplicationsComponent } from './document-scrutiny-step-iiapplications.component';

describe('DocumentScrutinyStepIIApplicationsComponent', () => {
  let component: DocumentScrutinyStepIIApplicationsComponent;
  let fixture: ComponentFixture<DocumentScrutinyStepIIApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyStepIIApplicationsComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyStepIIApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
