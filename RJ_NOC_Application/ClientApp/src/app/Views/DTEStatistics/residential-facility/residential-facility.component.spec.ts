import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentialFacilityComponent } from './residential-facility.component';

describe('ResidentialFacilityComponent', () => {
  let component: ResidentialFacilityComponent;
  let fixture: ComponentFixture<ResidentialFacilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResidentialFacilityComponent]
    });
    fixture = TestBed.createComponent(ResidentialFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
