import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBasicBScNCollegeOfNursingComponent } from './post-basic-bsc-ncollege-of-nursing.component';

describe('PostBasicBScNCollegeOfNursingComponent', () => {
  let component: PostBasicBScNCollegeOfNursingComponent;
  let fixture: ComponentFixture<PostBasicBScNCollegeOfNursingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostBasicBScNCollegeOfNursingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostBasicBScNCollegeOfNursingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
