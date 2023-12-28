import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationLandingDetailsDTEComponent } from './application-landing-details-dte.component';

describe('ApplicationLandingDetailsDTEComponent', () => {
  let component: ApplicationLandingDetailsDTEComponent;
  let fixture: ComponentFixture<ApplicationLandingDetailsDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationLandingDetailsDTEComponent]
    });
    fixture = TestBed.createComponent(ApplicationLandingDetailsDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
