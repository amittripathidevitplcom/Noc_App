import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCollegeSSOComponent } from './update-college-sso.component';

describe('UpdateCollegeSSOComponent', () => {
  let component: UpdateCollegeSSOComponent;
  let fixture: ComponentFixture<UpdateCollegeSSOComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCollegeSSOComponent]
    });
    fixture = TestBed.createComponent(UpdateCollegeSSOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
