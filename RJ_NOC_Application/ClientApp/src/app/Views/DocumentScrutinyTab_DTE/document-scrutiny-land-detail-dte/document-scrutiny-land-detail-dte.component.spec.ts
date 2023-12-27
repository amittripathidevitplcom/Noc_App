import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyLandDetailDTEComponent } from './document-scrutiny-land-detail-dte.component';

describe('DocumentScrutinyLandDetailDTEComponent', () => {
  let component: DocumentScrutinyLandDetailDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyLandDetailDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyLandDetailDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyLandDetailDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
