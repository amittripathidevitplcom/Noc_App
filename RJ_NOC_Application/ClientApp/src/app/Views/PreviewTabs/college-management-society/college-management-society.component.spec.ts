import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeManagementSocietyComponent } from './college-management-society.component';

describe('CollegeManagementSocietyComponent', () => {
  let component: CollegeManagementSocietyComponent;
  let fixture: ComponentFixture<CollegeManagementSocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegeManagementSocietyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeManagementSocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
