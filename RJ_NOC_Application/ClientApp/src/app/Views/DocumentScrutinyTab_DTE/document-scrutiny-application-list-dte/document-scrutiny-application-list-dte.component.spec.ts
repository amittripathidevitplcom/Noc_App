import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyApplicationListDTEComponent } from './document-scrutiny-application-list-dte.component';

describe('DocumentScrutinyApplicationListDTEComponent', () => {
  let component: DocumentScrutinyApplicationListDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyApplicationListDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyApplicationListDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyApplicationListDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
