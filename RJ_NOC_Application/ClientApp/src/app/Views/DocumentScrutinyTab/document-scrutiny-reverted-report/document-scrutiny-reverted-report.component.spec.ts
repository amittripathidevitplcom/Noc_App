import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyRevertedReportComponent } from './document-scrutiny-reverted-report.component';

describe('DocumentScrutinyRevertedReportComponent', () => {
  let component: DocumentScrutinyRevertedReportComponent;
  let fixture: ComponentFixture<DocumentScrutinyRevertedReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentScrutinyRevertedReportComponent]
    });
    fixture = TestBed.createComponent(DocumentScrutinyRevertedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
