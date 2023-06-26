import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandAreaSituatedComponent } from './land-area-situated.component';

describe('LandAreaSituatedComponent', () => {
  let component: LandAreaSituatedComponent;
  let fixture: ComponentFixture<LandAreaSituatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandAreaSituatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandAreaSituatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
