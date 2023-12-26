import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyDTEComponent } from './document-scrutiny-dte.component';

describe('DocumentScrutinyDTEComponent', () => {
  let component: DocumentScrutinyDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
