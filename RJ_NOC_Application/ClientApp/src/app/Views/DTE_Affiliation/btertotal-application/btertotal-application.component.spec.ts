import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERTotalApplicationComponent } from './btertotal-application.component';

describe('BTERTotalApplicationComponent', () => {
  let component: BTERTotalApplicationComponent;
  let fixture: ComponentFixture<BTERTotalApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERTotalApplicationComponent]
    });
    fixture = TestBed.createComponent(BTERTotalApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
