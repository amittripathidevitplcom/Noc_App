import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyCourseDetailDTEComponent } from './document-scrutiny-course-detail-dte.component';

describe('DocumentScrutinyCourseDetailDTEComponent', () => {
  let component: DocumentScrutinyCourseDetailDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyCourseDetailDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyCourseDetailDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyCourseDetailDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
