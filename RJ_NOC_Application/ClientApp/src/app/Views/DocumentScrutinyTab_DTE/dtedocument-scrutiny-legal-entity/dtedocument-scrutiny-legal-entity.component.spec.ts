import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEDocumentScrutinyLegalEntityComponent } from './dtedocument-scrutiny-legal-entity.component';

describe('DTEDocumentScrutinyLegalEntityComponent', () => {
  let component: DTEDocumentScrutinyLegalEntityComponent;
  let fixture: ComponentFixture<DTEDocumentScrutinyLegalEntityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTEDocumentScrutinyLegalEntityComponent]
    });
    fixture = TestBed.createComponent(DTEDocumentScrutinyLegalEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
