import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularForeignStudentEnrolmentComponent } from './regular-foreign-student-enrolment.component';

describe('RegularForeignStudentEnrolmentComponent', () => {
  let component: RegularForeignStudentEnrolmentComponent;
  let fixture: ComponentFixture<RegularForeignStudentEnrolmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegularForeignStudentEnrolmentComponent]
    });
    fixture = TestBed.createComponent(RegularForeignStudentEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
