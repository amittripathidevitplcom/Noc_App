import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhPreVerificationDoneListComponent } from './ah-pre-verification-done-list.component';

describe('AhPreVerificationDoneListComponent', () => {
  let component: AhPreVerificationDoneListComponent;
  let fixture: ComponentFixture<AhPreVerificationDoneListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AhPreVerificationDoneListComponent]
    });
    fixture = TestBed.createComponent(AhPreVerificationDoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
