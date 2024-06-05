import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyApplicationListDCEComponent } from './penalty-application-list-dce.component';

describe('PenaltyApplicationListDCEComponent', () => {
  let component: PenaltyApplicationListDCEComponent;
  let fixture: ComponentFixture<PenaltyApplicationListDCEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PenaltyApplicationListDCEComponent]
    });
    fixture = TestBed.createComponent(PenaltyApplicationListDCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
