import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaulterCollegeRequestComponent } from './defaulter-college-request.component';

describe('DefaulterCollegeRequestComponent', () => {
  let component: DefaulterCollegeRequestComponent;
  let fixture: ComponentFixture<DefaulterCollegeRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaulterCollegeRequestComponent]
    });
    fixture = TestBed.createComponent(DefaulterCollegeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
