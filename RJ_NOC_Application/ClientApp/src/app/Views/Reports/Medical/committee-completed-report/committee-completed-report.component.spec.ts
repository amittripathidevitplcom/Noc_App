import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeCompletedReportComponent } from './committee-completed-report.component';

describe('CommitteeCompletedReportComponent', () => {
  let component: CommitteeCompletedReportComponent;
  let fixture: ComponentFixture<CommitteeCompletedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeCompletedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeCompletedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
