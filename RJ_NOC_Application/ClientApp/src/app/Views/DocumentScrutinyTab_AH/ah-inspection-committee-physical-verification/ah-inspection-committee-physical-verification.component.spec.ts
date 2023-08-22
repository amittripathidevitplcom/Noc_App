import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhInspectionCommitteePhysicalVerificationComponent } from './ah-inspection-committee-physical-verification.component';

describe('AhInspectionCommitteePhysicalVerificationComponent', () => {
  let component: AhInspectionCommitteePhysicalVerificationComponent;
  let fixture: ComponentFixture<AhInspectionCommitteePhysicalVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AhInspectionCommitteePhysicalVerificationComponent]
    });
    fixture = TestBed.createComponent(AhInspectionCommitteePhysicalVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
