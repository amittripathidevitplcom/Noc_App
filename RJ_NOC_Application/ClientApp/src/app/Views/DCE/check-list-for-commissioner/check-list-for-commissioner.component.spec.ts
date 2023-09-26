import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListForCommissionerComponent } from './check-list-for-commissioner.component';

describe('CheckListForCommissionerComponent', () => {
  let component: CheckListForCommissionerComponent;
  let fixture: ComponentFixture<CheckListForCommissionerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckListForCommissionerComponent]
    });
    fixture = TestBed.createComponent(CheckListForCommissionerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
