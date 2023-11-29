import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyMGOneComponent } from './document-scrutiny-mgone.component';

describe('DocumentScrutinyMGOneComponent', () => {
  let component: DocumentScrutinyMGOneComponent;
  let fixture: ComponentFixture<DocumentScrutinyMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyMGOneComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
