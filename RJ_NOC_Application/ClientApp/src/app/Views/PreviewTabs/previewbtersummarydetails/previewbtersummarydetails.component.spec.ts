import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewbtersummarydetailsComponent } from './previewbtersummarydetails.component';

describe('PreviewbtersummarydetailsComponent', () => {
  let component: PreviewbtersummarydetailsComponent;
  let fixture: ComponentFixture<PreviewbtersummarydetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewbtersummarydetailsComponent]
    });
    fixture = TestBed.createComponent(PreviewbtersummarydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
