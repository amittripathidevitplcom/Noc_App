import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AHInfraDepartmentWiseComponent } from './ahinfra-department-wise.component';

describe('AHInfraDepartmentWiseComponent', () => {
  let component: AHInfraDepartmentWiseComponent;
  let fixture: ComponentFixture<AHInfraDepartmentWiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AHInfraDepartmentWiseComponent]
    });
    fixture = TestBed.createComponent(AHInfraDepartmentWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
