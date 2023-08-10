import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyVeterinaryHospitalComponent } from './document-scrutiny-veterinary-hospital.component';

describe('DocumentScrutinyVeterinaryHospitalComponent', () => {
  let component: DocumentScrutinyVeterinaryHospitalComponent;
  let fixture: ComponentFixture<DocumentScrutinyVeterinaryHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyVeterinaryHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyVeterinaryHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
