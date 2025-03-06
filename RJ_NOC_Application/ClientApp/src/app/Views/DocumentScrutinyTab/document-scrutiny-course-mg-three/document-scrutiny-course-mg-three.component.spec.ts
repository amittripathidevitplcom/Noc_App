import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyCourseMgThreeComponent } from './document-scrutiny-course-mg-three.component';

describe('DocumentScrutinyCourseMgThreeComponent', () => {
  let component: DocumentScrutinyCourseMgThreeComponent;
  let fixture: ComponentFixture<DocumentScrutinyCourseMgThreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyCourseMgThreeComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyCourseMgThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
