import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtOrderComponent } from './court-order.component';

describe('CourtOrderComponent', () => {
  let component: CourtOrderComponent;
  let fixture: ComponentFixture<CourtOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourtOrderComponent]
    });
    fixture = TestBed.createComponent(CourtOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
