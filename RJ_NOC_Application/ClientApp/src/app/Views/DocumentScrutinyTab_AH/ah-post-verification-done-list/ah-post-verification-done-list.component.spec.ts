import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhPostVerificationDoneListComponent } from './ah-post-verification-done-list.component';

describe('AhPostVerificationDoneListComponent', () => {
  let component: AhPostVerificationDoneListComponent;
  let fixture: ComponentFixture<AhPostVerificationDoneListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AhPostVerificationDoneListComponent]
    });
    fixture = TestBed.createComponent(AhPostVerificationDoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
