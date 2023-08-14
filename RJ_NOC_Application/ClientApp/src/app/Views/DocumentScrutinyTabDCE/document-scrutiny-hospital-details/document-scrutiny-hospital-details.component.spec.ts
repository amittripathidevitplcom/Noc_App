import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyHospitalDetailsComponent } from './document-scrutiny-hospital-details.component';

describe('DocumentScrutinyHospitalDetailsComponent', () => {
  let component: DocumentScrutinyHospitalDetailsComponent;
  let fixture: ComponentFixture<DocumentScrutinyHospitalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyHospitalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyHospitalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
