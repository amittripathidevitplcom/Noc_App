import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicationPenaltyDCEComponent } from './add-application-penalty-dce.component';

describe('AddApplicationPenaltyDCEComponent', () => {
  let component: AddApplicationPenaltyDCEComponent;
  let fixture: ComponentFixture<AddApplicationPenaltyDCEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddApplicationPenaltyDCEComponent]
    });
    fixture = TestBed.createComponent(AddApplicationPenaltyDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
