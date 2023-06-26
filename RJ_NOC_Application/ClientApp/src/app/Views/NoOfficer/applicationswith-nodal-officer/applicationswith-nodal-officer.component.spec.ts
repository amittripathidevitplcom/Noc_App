import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationswithNodalOfficerComponent } from './applicationswith-nodal-officer.component';

describe('ApplicationswithNodalOfficerComponent', () => {
  let component: ApplicationswithNodalOfficerComponent;
  let fixture: ComponentFixture<ApplicationswithNodalOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationswithNodalOfficerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationswithNodalOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
