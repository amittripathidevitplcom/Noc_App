import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertOfflinePaymentDetailsComponent } from './revert-offline-payment-details.component';

describe('RevertOfflinePaymentDetailsComponent', () => {
  let component: RevertOfflinePaymentDetailsComponent;
  let fixture: ComponentFixture<RevertOfflinePaymentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertOfflinePaymentDetailsComponent]
    });
    fixture = TestBed.createComponent(RevertOfflinePaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
