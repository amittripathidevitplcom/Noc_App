import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewOldNOCDetailComponent } from './preview-old-nocdetail.component';

describe('PreviewOldNOCDetailComponent', () => {
  let component: PreviewOldNOCDetailComponent;
  let fixture: ComponentFixture<PreviewOldNOCDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewOldNOCDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewOldNOCDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
