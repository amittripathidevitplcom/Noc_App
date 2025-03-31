import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERTotalSubmitedApplicationComponent } from './btertotal-submited-application.component';

describe('BTERTotalSubmitedApplicationComponent', () => {
  let component: BTERTotalSubmitedApplicationComponent;
  let fixture: ComponentFixture<BTERTotalSubmitedApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERTotalSubmitedApplicationComponent]
    });
    fixture = TestBed.createComponent(BTERTotalSubmitedApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
