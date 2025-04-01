import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERSocietyTrustDetailsPreviewComponent } from './btersociety-trust-details-preview.component';

describe('BTERSocietyTrustDetailsPreviewComponent', () => {
  let component: BTERSocietyTrustDetailsPreviewComponent;
  let fixture: ComponentFixture<BTERSocietyTrustDetailsPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERSocietyTrustDetailsPreviewComponent]
    });
    fixture = TestBed.createComponent(BTERSocietyTrustDetailsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
