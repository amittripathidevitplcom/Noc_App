import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MGThreeHospitalComponent } from './mgthree-hospital.component';

describe('MGThreeHospitalComponent', () => {
  let component: MGThreeHospitalComponent;
  let fixture: ComponentFixture<MGThreeHospitalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MGThreeHospitalComponent]
    });
    fixture = TestBed.createComponent(MGThreeHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
