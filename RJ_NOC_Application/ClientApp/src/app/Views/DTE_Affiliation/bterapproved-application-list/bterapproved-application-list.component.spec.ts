import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERApprovedApplicationListComponent } from './bterapproved-application-list.component';

describe('BTERApprovedApplicationListComponent', () => {
  let component: BTERApprovedApplicationListComponent;
  let fixture: ComponentFixture<BTERApprovedApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERApprovedApplicationListComponent]
    });
    fixture = TestBed.createComponent(BTERApprovedApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
