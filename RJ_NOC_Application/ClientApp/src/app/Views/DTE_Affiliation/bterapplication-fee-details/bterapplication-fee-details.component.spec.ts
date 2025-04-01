import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERApplicationFeeDetailsComponent } from './bterapplication-fee-details.component';

describe('BTERApplicationFeeDetailsComponent', () => {
  let component: BTERApplicationFeeDetailsComponent;
  let fixture: ComponentFixture<BTERApplicationFeeDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERApplicationFeeDetailsComponent]
    });
    fixture = TestBed.createComponent(BTERApplicationFeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
