import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyRequiredDocumentComponent } from './agri-document-scrutiny-required-document.component';

describe('AgriDocumentScrutinyRequiredDocumentComponent', () => {
  let component: AgriDocumentScrutinyRequiredDocumentComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyRequiredDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyRequiredDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyRequiredDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
