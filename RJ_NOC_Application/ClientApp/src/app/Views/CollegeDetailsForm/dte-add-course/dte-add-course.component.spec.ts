import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DteAddCourseComponent } from './dte-add-course.component';

describe('DteAddCourseComponent', () => {
  let component: DteAddCourseComponent;
  let fixture: ComponentFixture<DteAddCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DteAddCourseComponent]
    });
    fixture = TestBed.createComponent(DteAddCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
