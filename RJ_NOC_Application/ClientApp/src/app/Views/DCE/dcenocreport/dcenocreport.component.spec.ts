import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DCENOCReportComponent } from './dcenocreport.component';

describe('DCENOCReportComponent', () => {
  let component: DCENOCReportComponent;
  let fixture: ComponentFixture<DCENOCReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DCENOCReportComponent]
    });
    fixture = TestBed.createComponent(DCENOCReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
