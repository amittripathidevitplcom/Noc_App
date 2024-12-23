import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MGOneInfraDepartmentWiseComponent } from './mgone-infra-department-wise.component';

describe('MGOneInfraDepartmentWiseComponent', () => {
  let component: MGOneInfraDepartmentWiseComponent;
  let fixture: ComponentFixture<MGOneInfraDepartmentWiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MGOneInfraDepartmentWiseComponent]
    });
    fixture = TestBed.createComponent(MGOneInfraDepartmentWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
