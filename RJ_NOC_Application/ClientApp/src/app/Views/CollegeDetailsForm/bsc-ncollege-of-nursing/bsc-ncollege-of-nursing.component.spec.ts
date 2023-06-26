import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BScNCollegeOfNursingComponent } from './bsc-ncollege-of-nursing.component';

describe('BScNCollegeOfNursingComponent', () => {
  let component: BScNCollegeOfNursingComponent;
  let fixture: ComponentFixture<BScNCollegeOfNursingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BScNCollegeOfNursingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BScNCollegeOfNursingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
