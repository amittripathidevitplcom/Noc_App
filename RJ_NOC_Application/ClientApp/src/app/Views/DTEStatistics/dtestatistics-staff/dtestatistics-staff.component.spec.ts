import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEStatisticsStaffComponent } from './dtestatistics-staff.component';

describe('DTEStatisticsStaffComponent', () => {
  let component: DTEStatisticsStaffComponent;
  let fixture: ComponentFixture<DTEStatisticsStaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTEStatisticsStaffComponent]
    });
    fixture = TestBed.createComponent(DTEStatisticsStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
