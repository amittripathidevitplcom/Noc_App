import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentscrutinyforbterPaymentDetailsComponent } from './documentscrutinyforbter-payment-details.component';

describe('DocumentscrutinyforbterPaymentDetailsComponent', () => {
  let component: DocumentscrutinyforbterPaymentDetailsComponent;
  let fixture: ComponentFixture<DocumentscrutinyforbterPaymentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentscrutinyforbterPaymentDetailsComponent]
    });
    fixture = TestBed.createComponent(DocumentscrutinyforbterPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
