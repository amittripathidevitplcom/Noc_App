import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalEntityDepartmentWiseComponent } from './legal-entity-department-wise.component';

describe('LegalEntityDepartmentWiseComponent', () => {
  let component: LegalEntityDepartmentWiseComponent;
  let fixture: ComponentFixture<LegalEntityDepartmentWiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegalEntityDepartmentWiseComponent]
    });
    fixture = TestBed.createComponent(LegalEntityDepartmentWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
