import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliationRegistrationComponent } from './affiliation-registration.component';

describe('AffiliationRegistrationComponent', () => {
  let component: AffiliationRegistrationComponent;
  let fixture: ComponentFixture<AffiliationRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliationRegistrationComponent]
    });
    fixture = TestBed.createComponent(AffiliationRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
