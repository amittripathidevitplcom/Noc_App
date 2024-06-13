import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCourtOrderComponent } from './preview-court-order.component';

describe('PreviewCourtOrderComponent', () => {
  let component: PreviewCourtOrderComponent;
  let fixture: ComponentFixture<PreviewCourtOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewCourtOrderComponent]
    });
    fixture = TestBed.createComponent(PreviewCourtOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
