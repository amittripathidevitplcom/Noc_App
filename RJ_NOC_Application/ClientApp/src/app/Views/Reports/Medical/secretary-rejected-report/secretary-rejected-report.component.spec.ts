import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryRejectedReportComponent } from './secretary-rejected-report.component';

describe('SecretaryRejectedReportComponent', () => {
  let component: SecretaryRejectedReportComponent;
  let fixture: ComponentFixture<SecretaryRejectedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretaryRejectedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretaryRejectedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
