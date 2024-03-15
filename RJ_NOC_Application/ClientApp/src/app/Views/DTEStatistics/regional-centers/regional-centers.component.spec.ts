import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalCentersComponent } from './regional-centers.component';

describe('RegionalCentersComponent', () => {
  let component: RegionalCentersComponent;
  let fixture: ComponentFixture<RegionalCentersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionalCentersComponent]
    });
    fixture = TestBed.createComponent(RegionalCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
