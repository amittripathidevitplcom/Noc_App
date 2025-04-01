import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERGenerateOrderListComponent } from './btergenerate-order-list.component';

describe('BTERGenerateOrderListComponent', () => {
  let component: BTERGenerateOrderListComponent;
  let fixture: ComponentFixture<BTERGenerateOrderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERGenerateOrderListComponent]
    });
    fixture = TestBed.createComponent(BTERGenerateOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
