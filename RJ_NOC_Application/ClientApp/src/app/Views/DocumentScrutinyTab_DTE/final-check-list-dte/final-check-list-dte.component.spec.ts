import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalCheckListDTEComponent } from './final-check-list-dte.component';

describe('FinalCheckListDTEComponent', () => {
  let component: FinalCheckListDTEComponent;
  let fixture: ComponentFixture<FinalCheckListDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalCheckListDTEComponent]
    });
    fixture = TestBed.createComponent(FinalCheckListDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
