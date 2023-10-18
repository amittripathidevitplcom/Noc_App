import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDsCommitteePrimaryVerificationComponent } from './agri-ds-committee-primary-verification.component';

describe('AgriDsCommitteePrimaryVerificationComponent', () => {
  let component: AgriDsCommitteePrimaryVerificationComponent;
  let fixture: ComponentFixture<AgriDsCommitteePrimaryVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgriDsCommitteePrimaryVerificationComponent]
    });
    fixture = TestBed.createComponent(AgriDsCommitteePrimaryVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
