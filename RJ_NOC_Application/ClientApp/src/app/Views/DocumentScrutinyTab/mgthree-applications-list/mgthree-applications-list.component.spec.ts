import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MGThreeApplicationsListComponent } from './mgthree-applications-list.component';

describe('MGThreeApplicationsListComponent', () => {
  let component: MGThreeApplicationsListComponent;
  let fixture: ComponentFixture<MGThreeApplicationsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MGThreeApplicationsListComponent]
    });
    fixture = TestBed.createComponent(MGThreeApplicationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
