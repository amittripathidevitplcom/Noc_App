import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedApplicationListComponent } from './rejected-application-list.component';

describe('RejectedApplicationListComponent', () => {
  let component: RejectedApplicationListComponent;
  let fixture: ComponentFixture<RejectedApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RejectedApplicationListComponent]
    });
    fixture = TestBed.createComponent(RejectedApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
