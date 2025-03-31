import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEAddCollegeMasterComponent } from './dteadd-college-master.component';

describe('DTEAddCollegeMasterComponent', () => {
  let component: DTEAddCollegeMasterComponent;
  let fixture: ComponentFixture<DTEAddCollegeMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTEAddCollegeMasterComponent]
    });
    fixture = TestBed.createComponent(DTEAddCollegeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
