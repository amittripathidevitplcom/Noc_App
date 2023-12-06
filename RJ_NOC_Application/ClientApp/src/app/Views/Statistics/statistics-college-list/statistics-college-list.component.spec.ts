import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsCollegeListComponent } from './statistics-college-list.component';

describe('StatisticsCollegeListComponent', () => {
  let component: StatisticsCollegeListComponent;
  let fixture: ComponentFixture<StatisticsCollegeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsCollegeListComponent]
    });
    fixture = TestBed.createComponent(StatisticsCollegeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
