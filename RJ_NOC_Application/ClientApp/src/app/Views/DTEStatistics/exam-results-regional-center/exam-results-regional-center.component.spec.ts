import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamResultsRegionalCenterComponent } from './exam-results-regional-center.component';

describe('ExamResultsRegionalCenterComponent', () => {
  let component: ExamResultsRegionalCenterComponent;
  let fixture: ComponentFixture<ExamResultsRegionalCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamResultsRegionalCenterComponent]
    });
    fixture = TestBed.createComponent(ExamResultsRegionalCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
