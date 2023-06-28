import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewOtherDocumentComponent } from './preview-other-document.component';

describe('PreviewOtherDocumentComponent', () => {
  let component: PreviewOtherDocumentComponent;
  let fixture: ComponentFixture<PreviewOtherDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewOtherDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewOtherDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
