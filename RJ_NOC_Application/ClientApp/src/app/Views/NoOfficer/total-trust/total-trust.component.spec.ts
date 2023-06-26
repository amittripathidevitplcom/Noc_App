import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTrustComponent } from './total-trust.component';

describe('TotalTrustComponent', () => {
  let component: TotalTrustComponent;
  let fixture: ComponentFixture<TotalTrustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalTrustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalTrustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
