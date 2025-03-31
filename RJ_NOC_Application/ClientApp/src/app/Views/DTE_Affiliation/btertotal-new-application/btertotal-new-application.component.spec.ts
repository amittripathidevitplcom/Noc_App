import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERTotalNewApplicationComponent } from './btertotal-new-application.component';

describe('BTERTotalNewApplicationComponent', () => {
  let component: BTERTotalNewApplicationComponent;
  let fixture: ComponentFixture<BTERTotalNewApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERTotalNewApplicationComponent]
    });
    fixture = TestBed.createComponent(BTERTotalNewApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
