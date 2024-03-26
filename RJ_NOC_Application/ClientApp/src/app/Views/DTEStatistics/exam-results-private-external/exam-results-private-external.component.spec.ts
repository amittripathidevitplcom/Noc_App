import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamResultsPrivateExternalComponent } from './exam-results-private-external.component';

describe('ExamResultsPrivateExternalComponent', () => {
  let component: ExamResultsPrivateExternalComponent;
  let fixture: ComponentFixture<ExamResultsPrivateExternalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamResultsPrivateExternalComponent]
    });
    fixture = TestBed.createComponent(ExamResultsPrivateExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
