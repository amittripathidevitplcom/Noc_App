import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceOtherMinorityBreakupComponent } from './distance-other-minority-breakup.component';

describe('DistanceOtherMinorityBreakupComponent', () => {
  let component: DistanceOtherMinorityBreakupComponent;
  let fixture: ComponentFixture<DistanceOtherMinorityBreakupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistanceOtherMinorityBreakupComponent]
    });
    fixture = TestBed.createComponent(DistanceOtherMinorityBreakupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
