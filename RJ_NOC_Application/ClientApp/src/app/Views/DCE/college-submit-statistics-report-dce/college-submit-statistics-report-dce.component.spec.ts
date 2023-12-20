import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeSubmitStatisticsReportDCEComponent } from './college-submit-statistics-report-dce.component';

describe('CollegeSubmitStatisticsReportDCEComponent', () => {
  let component: CollegeSubmitStatisticsReportDCEComponent;
  let fixture: ComponentFixture<CollegeSubmitStatisticsReportDCEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollegeSubmitStatisticsReportDCEComponent]
    });
    fixture = TestBed.createComponent(CollegeSubmitStatisticsReportDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
