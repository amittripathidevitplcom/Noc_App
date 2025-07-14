import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBterCourseDetailsForAdminComponent } from './update-bter-course-details-for-admin.component';

describe('UpdateBterCourseDetailsForAdminComponent', () => {
  let component: UpdateBterCourseDetailsForAdminComponent;
  let fixture: ComponentFixture<UpdateBterCourseDetailsForAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateBterCourseDetailsForAdminComponent]
    });
    fixture = TestBed.createComponent(UpdateBterCourseDetailsForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
