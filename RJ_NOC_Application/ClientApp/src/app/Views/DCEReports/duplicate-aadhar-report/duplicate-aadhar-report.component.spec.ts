import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateAadharReportComponent } from './duplicate-aadhar-report.component';

describe('DuplicateAadharReportComponent', () => {
  let component: DuplicateAadharReportComponent;
  let fixture: ComponentFixture<DuplicateAadharReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DuplicateAadharReportComponent]
    });
    fixture = TestBed.createComponent(DuplicateAadharReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
