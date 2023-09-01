import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhFinalVerificationDoneListComponent } from './ah-final-verification-done-list.component';

describe('AhFinalVerificationDoneListComponent', () => {
  let component: AhFinalVerificationDoneListComponent;
  let fixture: ComponentFixture<AhFinalVerificationDoneListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AhFinalVerificationDoneListComponent]
    });
    fixture = TestBed.createComponent(AhFinalVerificationDoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
