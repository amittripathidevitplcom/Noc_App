import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEnrollmentRegularModeComponent } from './student-enrollment-regular-mode.component';

describe('StudentEnrollmentRegularModeComponent', () => {
  let component: StudentEnrollmentRegularModeComponent;
  let fixture: ComponentFixture<StudentEnrollmentRegularModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentEnrollmentRegularModeComponent]
    });
    fixture = TestBed.createComponent(StudentEnrollmentRegularModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
