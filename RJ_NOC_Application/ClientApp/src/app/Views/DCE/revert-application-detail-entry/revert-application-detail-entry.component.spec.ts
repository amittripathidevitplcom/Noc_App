import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertApplicationDetailEntryComponent } from './revert-application-detail-entry.component';

describe('RevertApplicationDetailEntryComponent', () => {
  let component: RevertApplicationDetailEntryComponent;
  let fixture: ComponentFixture<RevertApplicationDetailEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertApplicationDetailEntryComponent]
    });
    fixture = TestBed.createComponent(RevertApplicationDetailEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
