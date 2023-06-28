import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewHospitalDetailComponent } from './preview-hospital-detail.component';

describe('PreviewHospitalDetailComponent', () => {
  let component: PreviewHospitalDetailComponent;
  let fixture: ComponentFixture<PreviewHospitalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewHospitalDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewHospitalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
