import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertCheckListDCEComponent } from './revert-check-list-dce.component';

describe('RevertCheckListDCEComponent', () => {
  let component: RevertCheckListDCEComponent;
  let fixture: ComponentFixture<RevertCheckListDCEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertCheckListDCEComponent]
    });
    fixture = TestBed.createComponent(RevertCheckListDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
