import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyFacilityDTEComponent } from './document-scrutiny-facility-dte.component';

describe('DocumentScrutinyFacilityDTEComponent', () => {
  let component: DocumentScrutinyFacilityDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyFacilityDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyFacilityDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyFacilityDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
