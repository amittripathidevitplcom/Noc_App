import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalCentreDistanceModeComponent } from './regional-centre-distance-mode.component';

describe('RegionalCentreDistanceModeComponent', () => {
  let component: RegionalCentreDistanceModeComponent;
  let fixture: ComponentFixture<RegionalCentreDistanceModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionalCentreDistanceModeComponent]
    });
    fixture = TestBed.createComponent(RegionalCentreDistanceModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
