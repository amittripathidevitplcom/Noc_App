import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERCollegePreviewComponent } from './btercollege-preview.component';

describe('BTERCollegePreviewComponent', () => {
  let component: BTERCollegePreviewComponent;
  let fixture: ComponentFixture<BTERCollegePreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERCollegePreviewComponent]
    });
    fixture = TestBed.createComponent(BTERCollegePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
