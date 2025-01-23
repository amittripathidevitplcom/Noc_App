import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MGOneFacilitiesComponent } from './mgone-facilities.component';

describe('MGOneFacilitiesComponent', () => {
  let component: MGOneFacilitiesComponent;
  let fixture: ComponentFixture<MGOneFacilitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MGOneFacilitiesComponent]
    });
    fixture = TestBed.createComponent(MGOneFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
