import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MGOneForwardInpectionReportOSDComponent } from './mgone-forward-inpection-report-osd.component';

describe('MGOneForwardInpectionReportOSDComponent', () => {
  let component: MGOneForwardInpectionReportOSDComponent;
  let fixture: ComponentFixture<MGOneForwardInpectionReportOSDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MGOneForwardInpectionReportOSDComponent]
    });
    fixture = TestBed.createComponent(MGOneForwardInpectionReportOSDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
