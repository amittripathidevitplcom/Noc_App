import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERApplicationopensessionmasterComponent } from './bterapplicationopensessionmaster.component';

describe('BTERApplicationopensessionmasterComponent', () => {
  let component: BTERApplicationopensessionmasterComponent;
  let fixture: ComponentFixture<BTERApplicationopensessionmasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERApplicationopensessionmasterComponent]
    });
    fixture = TestBed.createComponent(BTERApplicationopensessionmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
