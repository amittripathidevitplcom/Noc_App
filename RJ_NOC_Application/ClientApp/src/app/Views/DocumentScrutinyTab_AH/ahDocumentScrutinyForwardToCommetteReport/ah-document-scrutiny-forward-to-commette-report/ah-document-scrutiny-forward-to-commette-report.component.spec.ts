import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDocumentScrutinyForwardToCommetteReportComponent } from './ah-document-scrutiny-forward-to-commette-report.component';

describe('AhDocumentScrutinyForwardToCommetteReportComponent', () => {
  let component: AhDocumentScrutinyForwardToCommetteReportComponent;
  let fixture: ComponentFixture<AhDocumentScrutinyForwardToCommetteReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AhDocumentScrutinyForwardToCommetteReportComponent]
    });
    fixture = TestBed.createComponent(AhDocumentScrutinyForwardToCommetteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
