import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JointSecretaryRejectedReportComponent } from './joint-secretary-rejected-report.component';

describe('JointSecretaryRejectedReportComponent', () => {
  let component: JointSecretaryRejectedReportComponent;
  let fixture: ComponentFixture<JointSecretaryRejectedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JointSecretaryRejectedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JointSecretaryRejectedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
