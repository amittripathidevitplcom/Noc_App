import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistoryReportCollegeWiseComponent } from './payment-history-report-college-wise.component';

describe('PaymentHistoryReportCollegeWiseComponent', () => {
  let component: PaymentHistoryReportCollegeWiseComponent;
  let fixture: ComponentFixture<PaymentHistoryReportCollegeWiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentHistoryReportCollegeWiseComponent]
    });
    fixture = TestBed.createComponent(PaymentHistoryReportCollegeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
