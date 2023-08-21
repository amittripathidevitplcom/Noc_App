import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyClassWiseStudentDetailsComponent } from './document-scrutiny-class-wise-student-details.component';

describe('DocumentScrutinyClassWiseStudentDetailsComponent', () => {
  let component: DocumentScrutinyClassWiseStudentDetailsComponent;
  let fixture: ComponentFixture<DocumentScrutinyClassWiseStudentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyClassWiseStudentDetailsComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyClassWiseStudentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
