import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MGoneFacilityEachComponent } from './mgone-facility-each.component';

describe('MGoneFacilityEachComponent', () => {
  let component: MGoneFacilityEachComponent;
  let fixture: ComponentFixture<MGoneFacilityEachComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MGoneFacilityEachComponent]
    });
    fixture = TestBed.createComponent(MGoneFacilityEachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
