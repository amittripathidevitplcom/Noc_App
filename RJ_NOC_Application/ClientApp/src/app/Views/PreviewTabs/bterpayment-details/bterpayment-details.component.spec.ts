import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERPaymentDetailsComponent } from './bterpayment-details.component';

describe('BTERPaymentDetailsComponent', () => {
  let component: BTERPaymentDetailsComponent;
  let fixture: ComponentFixture<BTERPaymentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERPaymentDetailsComponent]
    });
    fixture = TestBed.createComponent(BTERPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
