import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewGeoTagComponent } from './preview-geo-tag.component';

describe('PreviewGeoTagComponent', () => {
  let component: PreviewGeoTagComponent;
  let fixture: ComponentFixture<PreviewGeoTagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewGeoTagComponent]
    });
    fixture = TestBed.createComponent(PreviewGeoTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
