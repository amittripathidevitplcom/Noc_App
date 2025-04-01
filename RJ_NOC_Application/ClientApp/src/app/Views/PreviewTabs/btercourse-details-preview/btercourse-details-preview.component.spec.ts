import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERCourseDetailsPreviewComponent } from './btercourse-details-preview.component';

describe('BTERCourseDetailsPreviewComponent', () => {
  let component: BTERCourseDetailsPreviewComponent;
  let fixture: ComponentFixture<BTERCourseDetailsPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERCourseDetailsPreviewComponent]
    });
    fixture = TestBed.createComponent(BTERCourseDetailsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
