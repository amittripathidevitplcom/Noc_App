import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyOtherDocumentComponent } from './document-scrutiny-other-document.component';

describe('DocumentScrutinyOtherDocumentComponent', () => {
  let component: DocumentScrutinyOtherDocumentComponent;
  let fixture: ComponentFixture<DocumentScrutinyOtherDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyOtherDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyOtherDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
