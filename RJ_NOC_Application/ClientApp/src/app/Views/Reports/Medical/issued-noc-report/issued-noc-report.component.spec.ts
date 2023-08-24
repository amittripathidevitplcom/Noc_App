import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedNOCReportComponent } from './issued-nocreport.component';

describe('IssuedNOCReportComponent', () => {
  let component: IssuedNOCReportComponent;
  let fixture: ComponentFixture<IssuedNOCReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssuedNOCReportComponent]
    });
    fixture = TestBed.createComponent(IssuedNOCReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
