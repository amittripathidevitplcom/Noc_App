import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyPaymentDetailsDCEComponent } from './document-scrutiny-payment-details-dce.component';

describe('DocumentScrutinyPaymentDetailsDCEComponent', () => {
  let component: DocumentScrutinyPaymentDetailsDCEComponent;
  let fixture: ComponentFixture<DocumentScrutinyPaymentDetailsDCEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyPaymentDetailsDCEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyPaymentDetailsDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
