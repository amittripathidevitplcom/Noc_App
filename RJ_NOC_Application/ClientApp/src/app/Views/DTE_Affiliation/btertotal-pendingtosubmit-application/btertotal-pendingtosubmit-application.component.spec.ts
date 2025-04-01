import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERTotalPendingtosubmitApplicationComponent } from './btertotal-pendingtosubmit-application.component';

describe('BTERTotalPendingtosubmitApplicationComponent', () => {
  let component: BTERTotalPendingtosubmitApplicationComponent;
  let fixture: ComponentFixture<BTERTotalPendingtosubmitApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERTotalPendingtosubmitApplicationComponent]
    });
    fixture = TestBed.createComponent(BTERTotalPendingtosubmitApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
