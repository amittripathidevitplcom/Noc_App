import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewStaffDetailComponent } from './preview-staff-detail.component';

describe('PreviewStaffDetailComponent', () => {
  let component: PreviewStaffDetailComponent;
  let fixture: ComponentFixture<PreviewStaffDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewStaffDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewStaffDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
