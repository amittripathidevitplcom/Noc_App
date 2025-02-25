import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyCheckListDegreeComponent } from './document-scrutiny-check-list-degree.component';

describe('DocumentScrutinyCheckListDegreeComponent', () => {
  let component: DocumentScrutinyCheckListDegreeComponent;
  let fixture: ComponentFixture<DocumentScrutinyCheckListDegreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyCheckListDegreeComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyCheckListDegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
