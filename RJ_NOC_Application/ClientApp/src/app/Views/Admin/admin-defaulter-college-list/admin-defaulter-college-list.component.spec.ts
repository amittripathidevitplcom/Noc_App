import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDefaulterCollegeListComponent } from './admin-defaulter-college-list.component';

describe('AdminDefaulterCollegeListComponent', () => {
  let component: AdminDefaulterCollegeListComponent;
  let fixture: ComponentFixture<AdminDefaulterCollegeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDefaulterCollegeListComponent]
    });
    fixture = TestBed.createComponent(AdminDefaulterCollegeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
