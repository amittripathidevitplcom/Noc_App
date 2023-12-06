import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassWiseStaticReportDCEComponent } from './class-wise-static-report-dce.component';

describe('ClassWiseStaticReportDCEComponent', () => {
  let component: ClassWiseStaticReportDCEComponent;
  let fixture: ComponentFixture<ClassWiseStaticReportDCEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassWiseStaticReportDCEComponent]
    });
    fixture = TestBed.createComponent(ClassWiseStaticReportDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
