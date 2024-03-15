import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceModeComponent } from './distance-mode.component';

describe('DistanceModeComponent', () => {
  let component: DistanceModeComponent;
  let fixture: ComponentFixture<DistanceModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistanceModeComponent]
    });
    fixture = TestBed.createComponent(DistanceModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
