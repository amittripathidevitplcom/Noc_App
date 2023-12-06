import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListMGOneComponent } from './check-list-mgone.component';

describe('CheckListMGOneComponent', () => {
  let component: CheckListMGOneComponent;
  let fixture: ComponentFixture<CheckListMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckListMGOneComponent]
    });
    fixture = TestBed.createComponent(CheckListMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
