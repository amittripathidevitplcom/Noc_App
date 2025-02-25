import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalDraftBedCollegeListComponent } from './total-draft-bed-college-list.component';

describe('TotalDraftBedCollegeListComponent', () => {
  let component: TotalDraftBedCollegeListComponent;
  let fixture: ComponentFixture<TotalDraftBedCollegeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalDraftBedCollegeListComponent]
    });
    fixture = TestBed.createComponent(TotalDraftBedCollegeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
