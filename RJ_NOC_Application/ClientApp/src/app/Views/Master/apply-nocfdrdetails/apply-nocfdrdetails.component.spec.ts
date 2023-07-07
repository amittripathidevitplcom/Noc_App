import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyNOCFDRDetailsComponent } from './apply-nocfdrdetails.component';

describe('ApplyNOCFDRDetailsComponent', () => {
  let component: ApplyNOCFDRDetailsComponent;
  let fixture: ComponentFixture<ApplyNOCFDRDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyNOCFDRDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyNOCFDRDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
