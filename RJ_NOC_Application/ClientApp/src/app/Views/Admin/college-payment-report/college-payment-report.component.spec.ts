import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegePaymentReportComponent } from './college-payment-report.component';

describe('CollegePaymentReportComponent', () => {
  let component: CollegePaymentReportComponent;
  let fixture: ComponentFixture<CollegePaymentReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollegePaymentReportComponent]
    });
    fixture = TestBed.createComponent(CollegePaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
