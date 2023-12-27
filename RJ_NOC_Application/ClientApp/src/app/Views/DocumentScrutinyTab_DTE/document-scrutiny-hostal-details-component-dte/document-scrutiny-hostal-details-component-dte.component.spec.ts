import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyHostalDetailsComponentDTEComponent } from './document-scrutiny-hostal-details-component-dte.component';

describe('DocumentScrutinyHostalDetailsComponentDTEComponent', () => {
  let component: DocumentScrutinyHostalDetailsComponentDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyHostalDetailsComponentDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyHostalDetailsComponentDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyHostalDetailsComponentDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
