import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyLegalEntityComponent } from './ah-document-scrutiny-legal-entity.component';

describe('AhDocumentScrutinyLegalEntityComponent', () => {
  let component: AhDocumentScrutinyLegalEntityComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyLegalEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhDocumentScrutinyLegalEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDocumentScrutinyLegalEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
