import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAHInfraDepartmentWiseComponent } from './preview-ahinfra-department-wise.component';

describe('PreviewAHInfraDepartmentWiseComponent', () => {
  let component: PreviewAHInfraDepartmentWiseComponent;
  let fixture: ComponentFixture<PreviewAHInfraDepartmentWiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewAHInfraDepartmentWiseComponent]
    });
    fixture = TestBed.createComponent(PreviewAHInfraDepartmentWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
