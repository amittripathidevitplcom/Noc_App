import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateLOIReportMGOneComponent } from './generate-loireport-mgone.component';

describe('GenerateLOIReportMGOneComponent', () => {
  let component: GenerateLOIReportMGOneComponent;
  let fixture: ComponentFixture<GenerateLOIReportMGOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateLOIReportMGOneComponent]
    });
    fixture = TestBed.createComponent(GenerateLOIReportMGOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
