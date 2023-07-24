import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryCompletedReportComponent } from './secretary-completed-report.component';

describe('SecretaryCompletedReportComponent', () => {
  let component: SecretaryCompletedReportComponent;
  let fixture: ComponentFixture<SecretaryCompletedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretaryCompletedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretaryCompletedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
