import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMGThreeHospitalDetailsComponent } from './preview-mgthree-hospital-details.component';

describe('PreviewMGThreeHospitalDetailsComponent', () => {
  let component: PreviewMGThreeHospitalDetailsComponent;
  let fixture: ComponentFixture<PreviewMGThreeHospitalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewMGThreeHospitalDetailsComponent]
    });
    fixture = TestBed.createComponent(PreviewMGThreeHospitalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
