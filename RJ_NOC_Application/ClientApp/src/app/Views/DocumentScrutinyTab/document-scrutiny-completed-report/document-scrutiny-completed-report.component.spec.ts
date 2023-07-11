import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScrutinyReportComponent } from './document-scrutiny-report.component';

describe('DocumentScrutinyReportComponent', () => {
  let component: DocumentScrutinyReportComponent;
  let fixture: ComponentFixture<DocumentScrutinyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScrutinyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentScrutinyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
