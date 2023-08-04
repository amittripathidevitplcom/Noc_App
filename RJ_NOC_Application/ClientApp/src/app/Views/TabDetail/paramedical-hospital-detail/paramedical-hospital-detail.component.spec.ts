import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamedicalHospitalDetailComponent } from './paramedical-hospital-detail.component';

describe('ParamedicalHospitalDetailComponent', () => {
  let component: ParamedicalHospitalDetailComponent;
  let fixture: ComponentFixture<ParamedicalHospitalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParamedicalHospitalDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamedicalHospitalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
