import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLandDetailComponent } from './preview-land-detail.component';

describe('PreviewLandDetailComponent', () => {
  let component: PreviewLandDetailComponent;
  let fixture: ComponentFixture<PreviewLandDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewLandDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewLandDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
