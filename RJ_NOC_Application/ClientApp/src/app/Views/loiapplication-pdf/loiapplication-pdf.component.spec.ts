import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LOIApplicationPDFComponent } from './loiapplication-pdf.component';

describe('LOIApplicationPDFComponent', () => {
  let component: LOIApplicationPDFComponent;
  let fixture: ComponentFixture<LOIApplicationPDFComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LOIApplicationPDFComponent]
    });
    fixture = TestBed.createComponent(LOIApplicationPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
