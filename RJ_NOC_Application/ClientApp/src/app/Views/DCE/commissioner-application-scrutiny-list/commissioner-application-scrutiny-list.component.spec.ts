import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionerApplicationScrutinyListComponent } from './commissioner-application-scrutiny-list.component';

describe('CommissionerApplicationScrutinyListComponent', () => {
  let component: CommissionerApplicationScrutinyListComponent;
  let fixture: ComponentFixture<CommissionerApplicationScrutinyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommissionerApplicationScrutinyListComponent]
    });
    fixture = TestBed.createComponent(CommissionerApplicationScrutinyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
