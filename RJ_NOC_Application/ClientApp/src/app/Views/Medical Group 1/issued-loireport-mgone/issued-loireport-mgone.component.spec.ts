import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedLOIReportMGOneComponent } from './issued-loireport-mgone.component';

describe('IssuedLOIReportMGOneComponent', () => {
  let component: IssuedLOIReportMGOneComponent;
  let fixture: ComponentFixture<IssuedLOIReportMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssuedLOIReportMGOneComponent]
    });
    fixture = TestBed.createComponent(IssuedLOIReportMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
