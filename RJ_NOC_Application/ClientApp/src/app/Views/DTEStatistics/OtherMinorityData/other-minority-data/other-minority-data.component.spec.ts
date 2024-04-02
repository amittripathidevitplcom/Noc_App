import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherMinorityDataComponent } from './other-minority-data.component';

describe('OtherMinorityDataComponent', () => {
  let component: OtherMinorityDataComponent;
  let fixture: ComponentFixture<OtherMinorityDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherMinorityDataComponent]
    });
    fixture = TestBed.createComponent(OtherMinorityDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
