import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNocParameterDetailsComponent } from './apply-noc-parameter-details.component';

describe('ApplyNocParameterDetailsComponent', () => {
  let component: ApplyNocParameterDetailsComponent;
  let fixture: ComponentFixture<ApplyNocParameterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNocParameterDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNocParameterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
