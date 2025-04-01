import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertpaymentbterComponent } from './revertpaymentbter.component';

describe('RevertpaymentbterComponent', () => {
  let component: RevertpaymentbterComponent;
  let fixture: ComponentFixture<RevertpaymentbterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevertpaymentbterComponent]
    });
    fixture = TestBed.createComponent(RevertpaymentbterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
