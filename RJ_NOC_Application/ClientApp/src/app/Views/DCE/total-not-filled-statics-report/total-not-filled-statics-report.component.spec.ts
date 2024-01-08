import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalNotFilledStaticsReportComponent } from './total-not-filled-statics-report.component';

describe('TotalNotFilledStaticsReportComponent', () => {
  let component: TotalNotFilledStaticsReportComponent;
  let fixture: ComponentFixture<TotalNotFilledStaticsReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalNotFilledStaticsReportComponent]
    });
    fixture = TestBed.createComponent(TotalNotFilledStaticsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
