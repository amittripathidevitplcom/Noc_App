import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhPhysicalFinalVerificationComponent } from './ah-physical-final-verification.component';

describe('AhPhysicalFinalVerificationComponent', () => {
  let component: AhPhysicalFinalVerificationComponent;
  let fixture: ComponentFixture<AhPhysicalFinalVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AhPhysicalFinalVerificationComponent]
    });
    fixture = TestBed.createComponent(AhPhysicalFinalVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
