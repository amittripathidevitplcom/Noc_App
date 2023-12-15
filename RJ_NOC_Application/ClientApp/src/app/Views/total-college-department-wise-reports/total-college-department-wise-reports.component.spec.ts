import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCollegeDepartmentWiseReportsComponent } from './total-college-department-wise-reports.component';

describe('TotalCollegeDepartmentWiseReportsComponent', () => {
  let component: TotalCollegeDepartmentWiseReportsComponent;
  let fixture: ComponentFixture<TotalCollegeDepartmentWiseReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalCollegeDepartmentWiseReportsComponent]
    });
    fixture = TestBed.createComponent(TotalCollegeDepartmentWiseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
