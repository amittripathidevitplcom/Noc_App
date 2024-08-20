import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyFDRDetailsDCEComponent } from './document-scrutiny-fdrdetails-dce.component';

describe('DocumentScrutinyFDRDetailsDCEComponent', () => {
  let component: DocumentScrutinyFDRDetailsDCEComponent;
  let fixture: ComponentFixture<DocumentScrutinyFDRDetailsDCEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyFDRDetailsDCEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyFDRDetailsDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
