import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyVeterinaryHospitalComponent } from './ah-document-scrutiny-veterinary-hospital.component';

describe('AhDocumentScrutinyVeterinaryHospitalComponent', () => {
  let component: AhDocumentScrutinyVeterinaryHospitalComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyVeterinaryHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyVeterinaryHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyVeterinaryHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
