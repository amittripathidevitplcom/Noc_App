import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyCheckListDTEComponent } from './document-scrutiny-check-list-dte.component';

describe('DocumentScrutinyCheckListDTEComponent', () => {
  let component: DocumentScrutinyCheckListDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyCheckListDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyCheckListDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyCheckListDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
