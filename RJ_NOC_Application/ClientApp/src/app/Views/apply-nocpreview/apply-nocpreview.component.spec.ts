import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNOCPreviewComponent } from './apply-nocpreview.component';

describe('ApplyNOCPreviewComponent', () => {
  let component: ApplyNOCPreviewComponent;
  let fixture: ComponentFixture<ApplyNOCPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNOCPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNOCPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
