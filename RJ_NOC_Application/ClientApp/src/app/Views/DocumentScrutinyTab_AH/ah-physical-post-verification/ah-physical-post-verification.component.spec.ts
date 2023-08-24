import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhPhysicalPostVerificationComponent } from './ah-physical-post-verification.component';

describe('AhPhysicalPostVerificationComponent', () => {
  let component: AhPhysicalPostVerificationComponent;
  let fixture: ComponentFixture<AhPhysicalPostVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AhPhysicalPostVerificationComponent]
    });
    fixture = TestBed.createComponent(AhPhysicalPostVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
