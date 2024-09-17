import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockApplicationComponent } from './unlock-application.component';

describe('UnlockApplicationComponent', () => {
  let component: UnlockApplicationComponent;
  let fixture: ComponentFixture<UnlockApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnlockApplicationComponent]
    });
    fixture = TestBed.createComponent(UnlockApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
