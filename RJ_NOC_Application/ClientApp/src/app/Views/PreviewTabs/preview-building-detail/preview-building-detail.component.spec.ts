import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewBuildingDetailComponent } from './preview-building-detail.component';

describe('PreviewBuildingDetailComponent', () => {
  let component: PreviewBuildingDetailComponent;
  let fixture: ComponentFixture<PreviewBuildingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewBuildingDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewBuildingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
