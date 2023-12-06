import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeManagementSocietyRevertComponent } from './college-management-society-revert.component';

describe('CollegeManagementSocietyRevertComponent', () => {
  let component: CollegeManagementSocietyRevertComponent;
  let fixture: ComponentFixture<CollegeManagementSocietyRevertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollegeManagementSocietyRevertComponent]
    });
    fixture = TestBed.createComponent(CollegeManagementSocietyRevertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
