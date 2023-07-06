import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyRequiredDocumentComponent } from './document-scrutiny-required-document.component';

describe('DocumentScrutinyRequiredDocumentComponent', () => {
  let component: DocumentScrutinyRequiredDocumentComponent;
  let fixture: ComponentFixture<DocumentScrutinyRequiredDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyRequiredDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyRequiredDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
