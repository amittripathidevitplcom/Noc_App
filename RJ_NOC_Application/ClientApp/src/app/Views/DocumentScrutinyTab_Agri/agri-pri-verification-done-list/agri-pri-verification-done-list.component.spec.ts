import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriPriVerificationDoneListComponent } from './agri-pri-verification-done-list.component';

describe('AgriPriVerificationDoneListComponent', () => {
  let component: AgriPriVerificationDoneListComponent;
  let fixture: ComponentFixture<AgriPriVerificationDoneListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgriPriVerificationDoneListComponent]
    });
    fixture = TestBed.createComponent(AgriPriVerificationDoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
