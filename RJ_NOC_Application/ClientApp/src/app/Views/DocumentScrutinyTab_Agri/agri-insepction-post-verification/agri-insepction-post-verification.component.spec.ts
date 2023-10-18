import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriInsepctionPostVerificationComponent } from './agri-insepction-post-verification.component';

describe('AgriInsepctionPostVerificationComponent', () => {
  let component: AgriInsepctionPostVerificationComponent;
  let fixture: ComponentFixture<AgriInsepctionPostVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgriInsepctionPostVerificationComponent]
    });
    fixture = TestBed.createComponent(AgriInsepctionPostVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
