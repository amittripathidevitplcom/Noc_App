import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertApplicationDetailEntryDTEComponent } from './revert-application-detail-entry-dte.component';

describe('RevertApplicationDetailEntryDTEComponent', () => {
  let component: RevertApplicationDetailEntryDTEComponent;
  let fixture: ComponentFixture<RevertApplicationDetailEntryDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertApplicationDetailEntryDTEComponent]
    });
    fixture = TestBed.createComponent(RevertApplicationDetailEntryDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
