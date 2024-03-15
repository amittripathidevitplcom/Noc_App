import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEStatisticsDepartmentComponent } from './dtestatistics-department.component';

describe('DTEStatisticsDepartmentComponent', () => {
  let component: DTEStatisticsDepartmentComponent;
  let fixture: ComponentFixture<DTEStatisticsDepartmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTEStatisticsDepartmentComponent]
    });
    fixture = TestBed.createComponent(DTEStatisticsDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
