import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatInformationMasterComponent } from './seat-information-master.component';

describe('SeatInformationMasterComponent', () => {
  let component: SeatInformationMasterComponent;
  let fixture: ComponentFixture<SeatInformationMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeatInformationMasterComponent]
    });
    fixture = TestBed.createComponent(SeatInformationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
