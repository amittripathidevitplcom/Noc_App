import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNOCComponent } from './apply-noc.component';

describe('ApplyNOCComponent', () => {
  let component: ApplyNOCComponent;
  let fixture: ComponentFixture<ApplyNOCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNOCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
