import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewParamedicalHospitalDetailComponent } from './preview-paramedical-hospital-detail.component';

describe('PreviewParamedicalHospitalDetailComponent', () => {
  let component: PreviewParamedicalHospitalDetailComponent;
  let fixture: ComponentFixture<PreviewParamedicalHospitalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewParamedicalHospitalDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewParamedicalHospitalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
