import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNocParameterComponent } from './apply-noc-parameter.component';

describe('ApplyNocParameterComponent', () => {
  let component: ApplyNocParameterComponent;
  let fixture: ComponentFixture<ApplyNocParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNocParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNocParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
