import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEAffiliationDetailsComponent } from './dteaffiliation-details.component';

describe('DTEAffiliationDetailsComponent', () => {
  let component: DTEAffiliationDetailsComponent;
  let fixture: ComponentFixture<DTEAffiliationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTEAffiliationDetailsComponent]
    });
    fixture = TestBed.createComponent(DTEAffiliationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
