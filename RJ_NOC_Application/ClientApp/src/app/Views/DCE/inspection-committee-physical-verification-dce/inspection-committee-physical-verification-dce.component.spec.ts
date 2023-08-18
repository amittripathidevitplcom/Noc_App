import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionCommitteePhysicalVerificationDCEComponent } from './inspection-committee-physical-verification-dce.component';

describe('InspectionCommitteePhysicalVerificationDCEComponent', () => {
  let component: InspectionCommitteePhysicalVerificationDCEComponent;
  let fixture: ComponentFixture<InspectionCommitteePhysicalVerificationDCEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectionCommitteePhysicalVerificationDCEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionCommitteePhysicalVerificationDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
