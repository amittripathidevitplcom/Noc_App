import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyCollegeDetailDTEComponent } from './document-scrutiny-college-detail-dte.component';

describe('DocumentScrutinyCollegeDetailDTEComponent', () => {
  let component: DocumentScrutinyCollegeDetailDTEComponent;
  let fixture: ComponentFixture<DocumentScrutinyCollegeDetailDTEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyCollegeDetailDTEComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyCollegeDetailDTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
