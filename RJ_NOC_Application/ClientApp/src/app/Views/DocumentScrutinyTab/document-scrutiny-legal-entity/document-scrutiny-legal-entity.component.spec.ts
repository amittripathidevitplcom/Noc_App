import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyLegalEntityComponent } from './document-scrutiny-legal-entity.component';

describe('DocumentScrutinyLegalEntityComponent', () => {
  let component: DocumentScrutinyLegalEntityComponent;
  let fixture: ComponentFixture<DocumentScrutinyLegalEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyLegalEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyLegalEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
