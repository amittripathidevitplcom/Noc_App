import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyBuildingDetailDTEComponent } from './document-scrutiny-building-detail-dte.component';

describe('DocumentScrutinyBuildingDetailDTEComponent', () => {
  let component: DocumentScrutinyBuildingDetailDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyBuildingDetailDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyBuildingDetailDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyBuildingDetailDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
