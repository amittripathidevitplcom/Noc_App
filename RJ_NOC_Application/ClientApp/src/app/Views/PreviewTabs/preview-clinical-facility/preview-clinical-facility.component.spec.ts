import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewClinicalFacilityComponent } from './preview-clinical-facility.component';

describe('PreviewClinicalFacilityComponent', () => {
  let component: PreviewClinicalFacilityComponent;
  let fixture: ComponentFixture<PreviewClinicalFacilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewClinicalFacilityComponent]
    });
    fixture = TestBed.createComponent(PreviewClinicalFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
