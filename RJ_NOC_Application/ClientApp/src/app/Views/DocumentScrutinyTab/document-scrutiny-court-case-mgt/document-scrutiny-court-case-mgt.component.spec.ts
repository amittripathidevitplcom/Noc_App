import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyCourtCaseMGTComponent } from './document-scrutiny-court-case-mgt.component';

describe('DocumentScrutinyCourtCaseMGTComponent', () => {
  let component: DocumentScrutinyCourtCaseMGTComponent;
  let fixture: ComponentFixture<DocumentScrutinyCourtCaseMGTComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyCourtCaseMGTComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyCourtCaseMGTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
