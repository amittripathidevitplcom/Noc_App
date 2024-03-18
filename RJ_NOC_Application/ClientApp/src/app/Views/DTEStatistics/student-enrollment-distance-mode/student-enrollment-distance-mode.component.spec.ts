import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEnrollmentDistanceModeComponent } from './student-enrollment-distance-mode.component';

describe('StudentEnrollmentDistanceModeComponent', () => {
  let component: StudentEnrollmentDistanceModeComponent;
  let fixture: ComponentFixture<StudentEnrollmentDistanceModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentEnrollmentDistanceModeComponent]
    });
    fixture = TestBed.createComponent(StudentEnrollmentDistanceModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
