import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsDraftCollgerReportComponent } from './statistics-draft-collger-report.component';

describe('StatisticsDraftCollgerReportComponent', () => {
  let component: StatisticsDraftCollgerReportComponent;
  let fixture: ComponentFixture<StatisticsDraftCollgerReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsDraftCollgerReportComponent]
    });
    fixture = TestBed.createComponent(StatisticsDraftCollgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
