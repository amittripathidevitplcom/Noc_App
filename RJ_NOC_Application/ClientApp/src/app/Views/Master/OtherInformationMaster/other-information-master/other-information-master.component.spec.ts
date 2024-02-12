import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherInformationMasterComponent } from './other-information-master.component';

describe('OtherInformationMasterComponent', () => {
  let component: OtherInformationMasterComponent;
  let fixture: ComponentFixture<OtherInformationMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherInformationMasterComponent]
    });
    fixture = TestBed.createComponent(OtherInformationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
