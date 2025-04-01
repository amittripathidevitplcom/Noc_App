import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERPendingtoSubmitApplicationComponent } from './bterpendingto-submit-application.component';

describe('BTERPendingtoSubmitApplicationComponent', () => {
  let component: BTERPendingtoSubmitApplicationComponent;
  let fixture: ComponentFixture<BTERPendingtoSubmitApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERPendingtoSubmitApplicationComponent]
    });
    fixture = TestBed.createComponent(BTERPendingtoSubmitApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
