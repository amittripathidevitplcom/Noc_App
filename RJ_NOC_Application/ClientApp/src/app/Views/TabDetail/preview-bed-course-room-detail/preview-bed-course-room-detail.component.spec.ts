import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewBedCourseRoomDetailComponent } from './preview-bed-course-room-detail.component';

describe('PreviewBedCourseRoomDetailComponent', () => {
  let component: PreviewBedCourseRoomDetailComponent;
  let fixture: ComponentFixture<PreviewBedCourseRoomDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewBedCourseRoomDetailComponent]
    });
    fixture = TestBed.createComponent(PreviewBedCourseRoomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
