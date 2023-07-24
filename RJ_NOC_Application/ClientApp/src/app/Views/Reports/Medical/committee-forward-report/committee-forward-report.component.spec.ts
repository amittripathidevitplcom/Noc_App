import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeForwardReportComponent } from './committee-forward-report.component';

describe('CommitteeForwardReportComponent', () => {
  let component: CommitteeForwardReportComponent;
  let fixture: ComponentFixture<CommitteeForwardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeForwardReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeForwardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
