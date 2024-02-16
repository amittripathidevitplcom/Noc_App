import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPDFComponent } from './application-pdf.component';

describe('ApplicationPDFComponent', () => {
  let component: ApplicationPDFComponent;
  let fixture: ComponentFixture<ApplicationPDFComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationPDFComponent]
    });
    fixture = TestBed.createComponent(ApplicationPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
