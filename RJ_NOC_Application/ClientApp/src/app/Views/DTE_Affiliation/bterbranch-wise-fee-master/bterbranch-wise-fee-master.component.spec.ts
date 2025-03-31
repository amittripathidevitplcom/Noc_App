import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BTERBranchWiseFeeMasterComponent } from './bterbranch-wise-fee-master.component';

describe('BTERBranchWiseFeeMasterComponent', () => {
  let component: BTERBranchWiseFeeMasterComponent;
  let fixture: ComponentFixture<BTERBranchWiseFeeMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BTERBranchWiseFeeMasterComponent]
    });
    fixture = TestBed.createComponent(BTERBranchWiseFeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
