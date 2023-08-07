import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyParamedicalHospitalDetailComponent } from './document-scrutiny-paramedical-hospital-detail.component';

describe('DocumentScrutinyParamedicalHospitalDetailComponent', () => {
  let component: DocumentScrutinyParamedicalHospitalDetailComponent;
  let fixture: ComponentFixture<DocumentScrutinyParamedicalHospitalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyParamedicalHospitalDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyParamedicalHospitalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
