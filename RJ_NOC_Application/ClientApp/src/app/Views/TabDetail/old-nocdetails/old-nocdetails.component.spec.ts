import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldNOCDetailsComponent } from './old-nocdetails.component';

describe('OldNOCDetailsComponent', () => {
  let component: OldNOCDetailsComponent;
  let fixture: ComponentFixture<OldNOCDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldNOCDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldNOCDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
