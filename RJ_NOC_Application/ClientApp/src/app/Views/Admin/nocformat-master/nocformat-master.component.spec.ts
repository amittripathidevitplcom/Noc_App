import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NOCFormatMasterComponent } from './nocformat-master.component';

describe('NOCFormatMasterComponent', () => {
  let component: NOCFormatMasterComponent;
  let fixture: ComponentFixture<NOCFormatMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NOCFormatMasterComponent]
    });
    fixture = TestBed.createComponent(NOCFormatMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
