import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGrievanceComponent } from './new-grievance.component';

describe('NewGrievanceComponent', () => {
  let component: NewGrievanceComponent;
  let fixture: ComponentFixture<NewGrievanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewGrievanceComponent]
    });
    fixture = TestBed.createComponent(NewGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
