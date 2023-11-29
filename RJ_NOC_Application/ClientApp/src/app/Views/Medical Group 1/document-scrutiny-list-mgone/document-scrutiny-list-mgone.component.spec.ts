import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyListMGOneComponent } from './document-scrutiny-list-mgone.component';

describe('DocumentScrutinyListMGOneComponent', () => {
  let component: DocumentScrutinyListMGOneComponent;
  let fixture: ComponentFixture<DocumentScrutinyListMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyListMGOneComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyListMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
