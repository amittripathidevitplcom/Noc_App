import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalFacilityComponent } from './clinical-facility.component';

describe('ClinicalFacilityComponent', () => {
  let component: ClinicalFacilityComponent;
  let fixture: ComponentFixture<ClinicalFacilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicalFacilityComponent]
    });
    fixture = TestBed.createComponent(ClinicalFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
