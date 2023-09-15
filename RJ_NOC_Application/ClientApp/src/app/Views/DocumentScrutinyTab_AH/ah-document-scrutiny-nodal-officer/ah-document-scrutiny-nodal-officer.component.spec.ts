import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyNodalOfficerComponent } from './ah-document-scrutiny-nodal-officer.component';

describe('AhDocumentScrutinyNodalOfficerComponent', () => {
  let component: AhDocumentScrutinyNodalOfficerComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyNodalOfficerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AhDocumentScrutinyNodalOfficerComponent]
    });
    fixture = TestBed.createComponent(AhDocumentScrutinyNodalOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
