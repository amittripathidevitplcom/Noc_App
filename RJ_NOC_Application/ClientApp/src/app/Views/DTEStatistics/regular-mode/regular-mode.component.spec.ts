import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularModeComponent } from './regular-mode.component';

describe('RegularModeComponent', () => {
  let component: RegularModeComponent;
  let fixture: ComponentFixture<RegularModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegularModeComponent]
    });
    fixture = TestBed.createComponent(RegularModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
