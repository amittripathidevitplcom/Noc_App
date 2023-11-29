import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyCheckListMGOneComponent } from './document-scrutiny-check-list-mgone.component';

describe('DocumentScrutinyCheckListMGOneComponent', () => {
  let component: DocumentScrutinyCheckListMGOneComponent;
  let fixture: ComponentFixture<DocumentScrutinyCheckListMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyCheckListMGOneComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyCheckListMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
