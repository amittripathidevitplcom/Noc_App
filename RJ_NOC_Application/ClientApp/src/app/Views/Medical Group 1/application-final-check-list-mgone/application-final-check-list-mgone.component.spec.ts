import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFinalCheckListMGOneComponent } from './application-final-check-list-mgone.component';

describe('ApplicationFinalCheckListMGOneComponent', () => {
  let component: ApplicationFinalCheckListMGOneComponent;
  let fixture: ComponentFixture<ApplicationFinalCheckListMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationFinalCheckListMGOneComponent]
    });
    fixture = TestBed.createComponent(ApplicationFinalCheckListMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
