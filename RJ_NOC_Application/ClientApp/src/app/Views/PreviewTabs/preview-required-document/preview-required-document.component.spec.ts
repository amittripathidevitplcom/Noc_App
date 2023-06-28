import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewRequiredDocumentComponent } from './preview-required-document.component';

describe('PreviewRequiredDocumentComponent', () => {
  let component: PreviewRequiredDocumentComponent;
  let fixture: ComponentFixture<PreviewRequiredDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewRequiredDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewRequiredDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
