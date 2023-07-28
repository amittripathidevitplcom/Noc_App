import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNOCCompletedReportComponent } from './apply-noccompleted-report.component';

describe('ApplyNOCCompletedReportComponent', () => {
  let component: ApplyNOCCompletedReportComponent;
  let fixture: ComponentFixture<ApplyNOCCompletedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNOCCompletedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNOCCompletedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
