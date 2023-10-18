import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriPostVerificationDoneListComponent } from './agri-post-verification-done-list.component';

describe('AgriPostVerificationDoneListComponent', () => {
  let component: AgriPostVerificationDoneListComponent;
  let fixture: ComponentFixture<AgriPostVerificationDoneListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgriPostVerificationDoneListComponent]
    });
    fixture = TestBed.createComponent(AgriPostVerificationDoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
