import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationForwardGThreeComponent } from './application-forward-gthree.component';

describe('ApplicationForwardGThreeComponent', () => {
  let component: ApplicationForwardGThreeComponent;
  let fixture: ComponentFixture<ApplicationForwardGThreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationForwardGThreeComponent]
    });
    fixture = TestBed.createComponent(ApplicationForwardGThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
