import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewActivityDetailsComponent } from './preview-activity-details.component';

describe('PreviewActivityDetailsComponent', () => {
  let component: PreviewActivityDetailsComponent;
  let fixture: ComponentFixture<PreviewActivityDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewActivityDetailsComponent]
    });
    fixture = TestBed.createComponent(PreviewActivityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
