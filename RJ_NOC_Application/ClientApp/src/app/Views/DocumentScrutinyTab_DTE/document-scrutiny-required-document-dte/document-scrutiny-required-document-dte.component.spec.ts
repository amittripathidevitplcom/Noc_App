import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyRequiredDocumentDTEComponent } from './document-scrutiny-required-document-dte.component';

describe('DocumentScrutinyRequiredDocumentDTEComponent', () => {
  let component: DocumentScrutinyRequiredDocumentDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyRequiredDocumentDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyRequiredDocumentDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyRequiredDocumentDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
