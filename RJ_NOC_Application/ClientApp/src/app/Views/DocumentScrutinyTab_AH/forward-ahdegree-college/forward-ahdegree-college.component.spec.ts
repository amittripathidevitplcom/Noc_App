import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardAHDegreeCollegeComponent } from './forward-ahdegree-college.component';

describe('ForwardAHDegreeCollegeComponent', () => {
  let component: ForwardAHDegreeCollegeComponent;
  let fixture: ComponentFixture<ForwardAHDegreeCollegeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForwardAHDegreeCollegeComponent]
    });
    fixture = TestBed.createComponent(ForwardAHDegreeCollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
