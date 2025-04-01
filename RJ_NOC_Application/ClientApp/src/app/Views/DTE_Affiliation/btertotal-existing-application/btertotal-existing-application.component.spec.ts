import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERTotalExistingApplicationComponent } from './btertotal-existing-application.component';

describe('BTERTotalExistingApplicationComponent', () => {
  let component: BTERTotalExistingApplicationComponent;
  let fixture: ComponentFixture<BTERTotalExistingApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERTotalExistingApplicationComponent]
    });
    fixture = TestBed.createComponent(BTERTotalExistingApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
