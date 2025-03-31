import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERApplicationPDFComponent } from './bterapplication-pdf.component';

describe('BTERApplicationPDFComponent', () => {
  let component: BTERApplicationPDFComponent;
  let fixture: ComponentFixture<BTERApplicationPDFComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERApplicationPDFComponent]
    });
    fixture = TestBed.createComponent(BTERApplicationPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
