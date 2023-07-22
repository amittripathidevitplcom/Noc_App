import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JointSecretaryCompletedReportComponent } from './joint-secretary-completed-report.component';

describe('JointSecretaryCompletedReportComponent', () => {
  let component: JointSecretaryCompletedReportComponent;
  let fixture: ComponentFixture<JointSecretaryCompletedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JointSecretaryCompletedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JointSecretaryCompletedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
