import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertApplicationDetailEntryMGOneComponent } from './revert-application-detail-entry-mgone.component';

describe('RevertApplicationDetailEntryMGOneComponent', () => {
  let component: RevertApplicationDetailEntryMGOneComponent;
  let fixture: ComponentFixture<RevertApplicationDetailEntryMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertApplicationDetailEntryMGOneComponent]
    });
    fixture = TestBed.createComponent(RevertApplicationDetailEntryMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
