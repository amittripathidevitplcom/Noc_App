import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMGOneClinicalLabComponent } from './preview-mgone-clinical-lab.component';

describe('PreviewMGOneClinicalLabComponent', () => {
  let component: PreviewMGOneClinicalLabComponent;
  let fixture: ComponentFixture<PreviewMGOneClinicalLabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewMGOneClinicalLabComponent]
    });
    fixture = TestBed.createComponent(PreviewMGOneClinicalLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
