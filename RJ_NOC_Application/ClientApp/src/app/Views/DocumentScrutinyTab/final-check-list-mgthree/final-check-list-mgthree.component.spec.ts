import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalCheckListMGThreeComponent } from './final-check-list-mgthree.component';

describe('FinalCheckListMGThreeComponent', () => {
  let component: FinalCheckListMGThreeComponent;
  let fixture: ComponentFixture<FinalCheckListMGThreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalCheckListMGThreeComponent]
    });
    fixture = TestBed.createComponent(FinalCheckListMGThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
