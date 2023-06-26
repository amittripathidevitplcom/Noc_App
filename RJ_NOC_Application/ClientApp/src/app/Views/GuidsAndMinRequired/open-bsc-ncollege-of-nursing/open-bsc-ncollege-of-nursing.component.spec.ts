import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBScNCollegeOfNursingComponent } from './open-bsc-ncollege-of-nursing.component';

describe('OpenBScNCollegeOfNursingComponent', () => {
  let component: OpenBScNCollegeOfNursingComponent;
  let fixture: ComponentFixture<OpenBScNCollegeOfNursingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenBScNCollegeOfNursingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenBScNCollegeOfNursingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
