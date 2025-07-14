import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewInfrastructureMedicalCollegeFacilitiesmgoneComponent } from './preview-infrastructure-medical-college-facilitiesmgone.component';

describe('PreviewInfrastructureMedicalCollegeFacilitiesmgoneComponent', () => {
  let component: PreviewInfrastructureMedicalCollegeFacilitiesmgoneComponent;
  let fixture: ComponentFixture<PreviewInfrastructureMedicalCollegeFacilitiesmgoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewInfrastructureMedicalCollegeFacilitiesmgoneComponent]
    });
    fixture = TestBed.createComponent(PreviewInfrastructureMedicalCollegeFacilitiesmgoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
