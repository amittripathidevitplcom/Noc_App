import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MG1DocumentScrutinyHospitalDetailComponent } from './mg1-document-scrutiny-hospital-detail.component';

describe('MG1DocumentScrutinyHospitalDetailComponent', () => {
  let component: MG1DocumentScrutinyHospitalDetailComponent;
  let fixture: ComponentFixture<MG1DocumentScrutinyHospitalDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MG1DocumentScrutinyHospitalDetailComponent]
    });
    fixture = TestBed.createComponent(MG1DocumentScrutinyHospitalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
