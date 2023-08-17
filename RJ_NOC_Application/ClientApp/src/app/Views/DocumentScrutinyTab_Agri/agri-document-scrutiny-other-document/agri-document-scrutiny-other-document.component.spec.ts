import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyOtherDocumentComponent } from './agri-document-scrutiny-other-document.component';

describe('AgriDocumentScrutinyOtherDocumentComponent', () => {
  let component: AgriDocumentScrutinyOtherDocumentComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyOtherDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyOtherDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyOtherDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
