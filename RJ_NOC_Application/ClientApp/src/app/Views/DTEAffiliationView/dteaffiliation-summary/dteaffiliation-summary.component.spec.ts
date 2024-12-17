import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEAffiliationSummaryComponent } from './dteaffiliation-summary.component';

describe('DTEAffiliationSummaryComponent', () => {
  let component: DTEAffiliationSummaryComponent;
  let fixture: ComponentFixture<DTEAffiliationSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTEAffiliationSummaryComponent]
    });
    fixture = TestBed.createComponent(DTEAffiliationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
