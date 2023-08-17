import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriDocumentScrutinyLegalEntityComponent } from './agri-document-scrutiny-legal-entity.component';

describe('AgriDocumentScrutinyLegalEntityComponent', () => {
  let component: AgriDocumentScrutinyLegalEntityComponent;
  let fixture: ComponentFixture<AgriDocumentScrutinyLegalEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriDocumentScrutinyLegalEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriDocumentScrutinyLegalEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
