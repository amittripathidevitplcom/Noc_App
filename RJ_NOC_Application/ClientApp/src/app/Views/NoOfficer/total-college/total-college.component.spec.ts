import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCollegeComponent } from './total-college.component';

describe('TotalCollegeComponent', () => {
  let component: TotalCollegeComponent;
  let fixture: ComponentFixture<TotalCollegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalCollegeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalCollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
