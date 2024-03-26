import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipFellowshipLoanAccComponent } from './scholarship-fellowship-loan-acc.component';

describe('ScholarshipFellowshipLoanAccComponent', () => {
  let component: ScholarshipFellowshipLoanAccComponent;
  let fixture: ComponentFixture<ScholarshipFellowshipLoanAccComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScholarshipFellowshipLoanAccComponent]
    });
    fixture = TestBed.createComponent(ScholarshipFellowshipLoanAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
