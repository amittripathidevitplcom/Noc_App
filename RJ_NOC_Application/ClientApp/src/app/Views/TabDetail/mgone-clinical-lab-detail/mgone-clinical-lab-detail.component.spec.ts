import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MGOneClinicalLabDetailComponent } from './mgone-clinical-lab-detail.component';

describe('MGOneClinicalLabDetailComponent', () => {
  let component: MGOneClinicalLabDetailComponent;
  let fixture: ComponentFixture<MGOneClinicalLabDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MGOneClinicalLabDetailComponent]
    });
    fixture = TestBed.createComponent(MGOneClinicalLabDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
