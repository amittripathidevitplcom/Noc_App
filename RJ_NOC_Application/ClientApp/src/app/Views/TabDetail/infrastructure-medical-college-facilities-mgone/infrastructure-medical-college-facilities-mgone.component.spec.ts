import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureMedicalCollegeFacilitiesMgoneComponent } from './infrastructure-medical-college-facilities-mgone.component';

describe('InfrastructureMedicalCollegeFacilitiesMgoneComponent', () => {
  let component: InfrastructureMedicalCollegeFacilitiesMgoneComponent;
  let fixture: ComponentFixture<InfrastructureMedicalCollegeFacilitiesMgoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfrastructureMedicalCollegeFacilitiesMgoneComponent]
    });
    fixture = TestBed.createComponent(InfrastructureMedicalCollegeFacilitiesMgoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
