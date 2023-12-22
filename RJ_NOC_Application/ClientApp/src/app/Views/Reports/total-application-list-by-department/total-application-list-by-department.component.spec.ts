import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalApplicationListByDepartmentComponent } from './total-application-list-by-department.component';

describe('TotalApplicationListByDepartmentComponent', () => {
  let component: TotalApplicationListByDepartmentComponent;
  let fixture: ComponentFixture<TotalApplicationListByDepartmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalApplicationListByDepartmentComponent]
    });
    fixture = TestBed.createComponent(TotalApplicationListByDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
