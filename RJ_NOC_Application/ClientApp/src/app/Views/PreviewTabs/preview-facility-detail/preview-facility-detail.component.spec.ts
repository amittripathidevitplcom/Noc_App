import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewFacilityDetailComponent } from './preview-facility-detail.component';

describe('PreviewFacilityDetailComponent', () => {
  let component: PreviewFacilityDetailComponent;
  let fixture: ComponentFixture<PreviewFacilityDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewFacilityDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewFacilityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
