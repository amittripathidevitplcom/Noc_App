import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewVeterinaryHospitalComponent } from './preview-veterinary-hospital.component';

describe('PreviewVeterinaryHospitalComponent', () => {
  let component: PreviewVeterinaryHospitalComponent;
  let fixture: ComponentFixture<PreviewVeterinaryHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewVeterinaryHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewVeterinaryHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
