import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeRejectedReportComponent } from './committee-rejected-report.component';

describe('CommitteeRejectedReportComponent', () => {
  let component: CommitteeRejectedReportComponent;
  let fixture: ComponentFixture<CommitteeRejectedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeRejectedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeRejectedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
