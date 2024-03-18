import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementDetailsComponent } from './placement-details.component';

describe('PlacementDetailsComponent', () => {
  let component: PlacementDetailsComponent;
  let fixture: ComponentFixture<PlacementDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementDetailsComponent]
    });
    fixture = TestBed.createComponent(PlacementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
