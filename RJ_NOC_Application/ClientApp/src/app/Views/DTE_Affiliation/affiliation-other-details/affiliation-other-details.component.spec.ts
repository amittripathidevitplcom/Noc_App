import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliationOtherDetailsComponent } from './affiliation-other-details.component';

describe('AffiliationOtherDetailsComponent', () => {
  let component: AffiliationOtherDetailsComponent;
  let fixture: ComponentFixture<AffiliationOtherDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliationOtherDetailsComponent]
    });
    fixture = TestBed.createComponent(AffiliationOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
