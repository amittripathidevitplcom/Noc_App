import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERReceivedApplicationsComponent } from './bterreceived-applications.component';

describe('BTERReceivedApplicationsComponent', () => {
  let component: BTERReceivedApplicationsComponent;
  let fixture: ComponentFixture<BTERReceivedApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERReceivedApplicationsComponent]
    });
    fixture = TestBed.createComponent(BTERReceivedApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
