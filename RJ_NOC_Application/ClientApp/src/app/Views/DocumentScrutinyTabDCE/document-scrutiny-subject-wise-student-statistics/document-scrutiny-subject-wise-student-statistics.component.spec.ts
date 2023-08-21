import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinySubjectWiseStudentStatisticsComponent } from './document-scrutiny-subject-wise-student-statistics.component';

describe('DocumentScrutinySubjectWiseStudentStatisticsComponent', () => {
  let component: DocumentScrutinySubjectWiseStudentStatisticsComponent;
  let fixture: ComponentFixture<DocumentScrutinySubjectWiseStudentStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinySubjectWiseStudentStatisticsComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinySubjectWiseStudentStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
