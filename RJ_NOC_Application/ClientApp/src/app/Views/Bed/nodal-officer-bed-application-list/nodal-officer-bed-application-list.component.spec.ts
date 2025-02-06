import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalOfficerBedApplicationListComponent } from './nodal-officer-bed-application-list.component';

describe('NodalOfficerBedApplicationListComponent', () => {
  let component: NodalOfficerBedApplicationListComponent;
  let fixture: ComponentFixture<NodalOfficerBedApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodalOfficerBedApplicationListComponent]
    });
    fixture = TestBed.createComponent(NodalOfficerBedApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
