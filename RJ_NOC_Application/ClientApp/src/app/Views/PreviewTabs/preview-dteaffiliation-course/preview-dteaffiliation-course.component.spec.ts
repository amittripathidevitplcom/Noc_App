import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDTEAffiliationCourseComponent } from './preview-dteaffiliation-course.component';

describe('PreviewDTEAffiliationCourseComponent', () => {
  let component: PreviewDTEAffiliationCourseComponent;
  let fixture: ComponentFixture<PreviewDTEAffiliationCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewDTEAffiliationCourseComponent]
    });
    fixture = TestBed.createComponent(PreviewDTEAffiliationCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
