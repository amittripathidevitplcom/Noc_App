import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyOtherInfrastuctureDTEComponent } from './document-scrutiny-other-infrastucture-dte.component';

describe('DocumentScrutinyOtherInfrastuctureDTEComponent', () => {
  let component: DocumentScrutinyOtherInfrastuctureDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyOtherInfrastuctureDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyOtherInfrastuctureDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyOtherInfrastuctureDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
