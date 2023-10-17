import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriPreViewByNodalOfficerComponent } from './agri-pre-view-by-nodal-officer.component';

describe('AgriPreViewByNodalOfficerComponent', () => {
  let component: AgriPreViewByNodalOfficerComponent;
  let fixture: ComponentFixture<AgriPreViewByNodalOfficerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgriPreViewByNodalOfficerComponent]
    });
    fixture = TestBed.createComponent(AgriPreViewByNodalOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
