import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertCheckListDTEComponent } from './revert-check-list-dte.component';

describe('RevertCheckListDTEComponent', () => {
  let component: RevertCheckListDTEComponent;
  let fixture: ComponentFixture<RevertCheckListDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertCheckListDTEComponent]
    });
    fixture = TestBed.createComponent(RevertCheckListDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
