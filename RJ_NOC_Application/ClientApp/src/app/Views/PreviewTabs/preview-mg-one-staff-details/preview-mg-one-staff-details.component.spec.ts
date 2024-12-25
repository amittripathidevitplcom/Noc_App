import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMgOneStaffDetailsComponent } from './preview-mg-one-staff-details.component';

describe('PreviewMgOneStaffDetailsComponent', () => {
  let component: PreviewMgOneStaffDetailsComponent;
  let fixture: ComponentFixture<PreviewMgOneStaffDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewMgOneStaffDetailsComponent]
    });
    fixture = TestBed.createComponent(PreviewMgOneStaffDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
