import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateExternalModeComponent } from './private-external-mode.component';

describe('PrivateExternalModeComponent', () => {
  let component: PrivateExternalModeComponent;
  let fixture: ComponentFixture<PrivateExternalModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivateExternalModeComponent]
    });
    fixture = TestBed.createComponent(PrivateExternalModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
