import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyRejectedReportComponent } from './document-scrutiny-rejected-report.component';

describe('DocumentScrutinyRejectedReportComponent', () => {
  let component: DocumentScrutinyRejectedReportComponent;
  let fixture: ComponentFixture<DocumentScrutinyRejectedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyRejectedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyRejectedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
