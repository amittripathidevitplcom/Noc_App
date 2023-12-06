import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewClasswiseStaticComponent } from './preview-classwise-static.component';

describe('PreviewClasswiseStaticComponent', () => {
  let component: PreviewClasswiseStaticComponent;
  let fixture: ComponentFixture<PreviewClasswiseStaticComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewClasswiseStaticComponent]
    });
    fixture = TestBed.createComponent(PreviewClasswiseStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
