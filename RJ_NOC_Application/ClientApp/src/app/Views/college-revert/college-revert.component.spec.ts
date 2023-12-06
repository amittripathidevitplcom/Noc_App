import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeRevertComponent } from './college-revert.component';

describe('CollegeRevertComponent', () => {
  let component: CollegeRevertComponent;
  let fixture: ComponentFixture<CollegeRevertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollegeRevertComponent]
    });
    fixture = TestBed.createComponent(CollegeRevertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
