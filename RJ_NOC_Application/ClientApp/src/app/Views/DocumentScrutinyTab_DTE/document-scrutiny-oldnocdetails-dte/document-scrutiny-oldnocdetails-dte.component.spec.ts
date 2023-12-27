import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyOLDNOCDetailsDTEComponent } from './document-scrutiny-oldnocdetails-dte.component';

describe('DocumentScrutinyOLDNOCDetailsDTEComponent', () => {
  let component: DocumentScrutinyOLDNOCDetailsDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyOLDNOCDetailsDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyOLDNOCDetailsDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyOLDNOCDetailsDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
