import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LOIApplyEntryComponent } from './loiapply-entry.component';

describe('LOIApplyEntryComponent', () => {
  let component: LOIApplyEntryComponent;
  let fixture: ComponentFixture<LOIApplyEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LOIApplyEntryComponent]
    });
    fixture = TestBed.createComponent(LOIApplyEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
