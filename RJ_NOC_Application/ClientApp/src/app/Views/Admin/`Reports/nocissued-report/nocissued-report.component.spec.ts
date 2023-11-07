import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NOCIssuedReportComponent } from './nocissued-report.component';

describe('NOCIssuedReportComponent', () => {
  let component: NOCIssuedReportComponent;
  let fixture: ComponentFixture<NOCIssuedReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NOCIssuedReportComponent]
    });
    fixture = TestBed.createComponent(NOCIssuedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
