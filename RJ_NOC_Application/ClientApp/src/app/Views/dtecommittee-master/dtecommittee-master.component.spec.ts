import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTECommitteeMasterComponent } from './dtecommittee-master.component';

describe('DTECommitteeMasterComponent', () => {
  let component: DTECommitteeMasterComponent;
  let fixture: ComponentFixture<DTECommitteeMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTECommitteeMasterComponent]
    });
    fixture = TestBed.createComponent(DTECommitteeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
