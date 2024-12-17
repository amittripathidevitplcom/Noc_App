import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliationAddCourseComponent } from './affiliation-add-course.component';

describe('AffiliationAddCourseComponent', () => {
  let component: AffiliationAddCourseComponent;
  let fixture: ComponentFixture<AffiliationAddCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliationAddCourseComponent]
    });
    fixture = TestBed.createComponent(AffiliationAddCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
