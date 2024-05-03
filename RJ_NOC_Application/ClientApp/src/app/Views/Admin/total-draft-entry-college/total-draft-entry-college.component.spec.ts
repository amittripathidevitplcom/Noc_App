import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalDraftEntryCollegeComponent } from './total-draft-entry-college.component';

describe('TotalDraftEntryCollegeComponent', () => {
  let component: TotalDraftEntryCollegeComponent;
  let fixture: ComponentFixture<TotalDraftEntryCollegeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalDraftEntryCollegeComponent]
    });
    fixture = TestBed.createComponent(TotalDraftEntryCollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
