import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERPaymentStatusComponent } from './bterpayment-status.component';

describe('BTERPaymentStatusComponent', () => {
  let component: BTERPaymentStatusComponent;
  let fixture: ComponentFixture<BTERPaymentStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERPaymentStatusComponent]
    });
    fixture = TestBed.createComponent(BTERPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
