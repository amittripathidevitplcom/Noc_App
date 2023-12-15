import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeReportDCEComponent } from './college-report-dce.component';

describe('CollegeReportDCEComponent', () => {
  let component: CollegeReportDCEComponent;
  let fixture: ComponentFixture<CollegeReportDCEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollegeReportDCEComponent]
    });
    fixture = TestBed.createComponent(CollegeReportDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
