import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectWiseStaticReportDCEComponent } from './subject-wise-static-report-dce.component';

describe('SubjectWiseStaticReportDCEComponent', () => {
  let component: SubjectWiseStaticReportDCEComponent;
  let fixture: ComponentFixture<SubjectWiseStaticReportDCEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectWiseStaticReportDCEComponent]
    });
    fixture = TestBed.createComponent(SubjectWiseStaticReportDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
