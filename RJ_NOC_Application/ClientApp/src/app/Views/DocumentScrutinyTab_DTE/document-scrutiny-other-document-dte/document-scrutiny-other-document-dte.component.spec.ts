import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyOtherDocumentDTEComponent } from './document-scrutiny-other-document-dte.component';

describe('DocumentScrutinyOtherDocumentDTEComponent', () => {
  let component: DocumentScrutinyOtherDocumentDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyOtherDocumentDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyOtherDocumentDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyOtherDocumentDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
