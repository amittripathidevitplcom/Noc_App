import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneStepRevertBackComponent } from './one-step-revert-back.component';

describe('OneStepRevertBackComponent', () => {
  let component: OneStepRevertBackComponent;
  let fixture: ComponentFixture<OneStepRevertBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneStepRevertBackComponent]
    });
    fixture = TestBed.createComponent(OneStepRevertBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
