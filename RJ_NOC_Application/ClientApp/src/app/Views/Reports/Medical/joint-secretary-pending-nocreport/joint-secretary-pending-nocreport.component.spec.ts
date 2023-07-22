import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JointSecretaryPendingNOCReportComponent } from './joint-secretary-pending-nocreport.component';

describe('JointSecretaryPendingNOCReportComponent', () => {
  let component: JointSecretaryPendingNOCReportComponent;
  let fixture: ComponentFixture<JointSecretaryPendingNOCReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JointSecretaryPendingNOCReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JointSecretaryPendingNOCReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
