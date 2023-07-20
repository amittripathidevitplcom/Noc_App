import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinaryHospitalComponent } from './veterinary-hospital.component';

describe('VeterinaryHospitalComponent', () => {
  let component: VeterinaryHospitalComponent;
  let fixture: ComponentFixture<VeterinaryHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VeterinaryHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VeterinaryHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
